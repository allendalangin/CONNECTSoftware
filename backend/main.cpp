#include "crow_all.h"
#include "Pages.h"
#include "OrgView.h"
#include "AdminView.h"
#include <fstream>
#include <iostream>
#include <filesystem>
#include <sstream>
#include <iomanip>

// Define urlDecode function here
std::string urlDecode(const std::string &src) {
    std::ostringstream decoded;
    for (size_t i = 0; i < src.length(); ++i) {
        if (src[i] == '%') {
            int value;
            std::istringstream is(src.substr(i + 1, 2));
            if (is >> std::hex >> value) {
                decoded << static_cast<char>(value);
                i += 2;
            }
        } else if (src[i] == '+') {
            decoded << ' ';
        } else {
            decoded << src[i];
        }
    }
    return decoded.str();
}

int main() {
    crow::SimpleApp app;
    Pages pages; 
    OrgView orgView;
    AdminView osaarView, cdmoView;

    // Handle login POST requests
    CROW_ROUTE(app, "/login").methods("POST"_method)([&pages](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) {
            return crow::response(400, "Invalid JSON");
        }

        std::string username = body["username"].s();
        std::string password = body["password"].s();
        std::string type = body["type"].s();
        std::string loginState;

        if (type == "Org") {
            loginState = pages.orgLogIn(username, password);
        } else if (type == "CDMO") {
            loginState = pages.cdmoLogIn(username, password);
        } else if (type == "OSAAR") {
            loginState = pages.osaarLogIn(username, password);
        } else {
            return crow::response(400, "Invalid login type");
        }

        crow::json::wvalue response;
        if (loginState == "true") {
            response["success"] = true;
            response["message"] = "Login successful";
        } else {
            response["success"] = false;
            response["message"] = "Invalid credentials";
        }

        return crow::response(200, response);
    });

    // Handle signup POST requests
    CROW_ROUTE(app, "/signin").methods("POST"_method)([&pages](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) {
            return crow::response(400, "Invalid JSON");
        }

        std::string username = body["username"].s();
        std::string password = body["password"].s();
        std::string type = body["type"].s();
        std::string signUpState;

        signUpState = pages.signUp(username, password, type);

        crow::json::wvalue response;
        if (signUpState == "takenUser") {
            response["success"] = false;
            response["message"] = "Username is already taken";
        } else if (signUpState == "invalidPass") {
            response["success"] = false;
            response["message"] = "Password does not meet security requirements";
        } else if (signUpState == "noType") {
            response["success"] = false;
            response["message"] = "No account type has been selected";
        } else if (signUpState == "done") {
            response["success"] = true;
            response["message"] = "Sign up successful";
        } else {
            response["success"] = false;
            response["message"] = "An unknown error occurred during signup";
        }

        return crow::response(200, response);
    });

    // Handle add event POST requests
    CROW_ROUTE(app, "/addevent").methods("POST"_method)([&orgView, &cdmoView, &osaarView](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) {
            return crow::response(400, "Invalid JSON");
        }

        std::string eventName = body["eventName"].s();
        std::string eventDate = body["eventDate"].s();
        std::string eventVenue = body["eventVenue"].s();
        std::string eventObjectives = body["eventObjectives"].s();
        std::string eventSDGs = body["eventSDGs"].s();
        std::string username = body["username"].s();

        std::string createEventState = orgView.createEvent(eventName, eventDate, eventVenue, eventObjectives, eventSDGs, username);
        std::string creatCDMOEventState = cdmoView.createEvent(eventName, eventDate, eventVenue, eventObjectives, eventSDGs, username, "CDMO");
        std::string creatOSAAREventState = osaarView.createEvent(eventName, eventDate, eventVenue, eventObjectives, eventSDGs, username, "OSAAR");
        crow::json::wvalue response;
        if (createEventState == "done") {
            response["success"] = true;
            response["message"] = "Event created successfully";
        } else if (createEventState == "eventExists") {
            response["success"] = false;
            response["message"] = "Event already exists, please resubmit changes instead";
        } else {
            response["success"] = false;
            response["message"] = createEventState;
        }

        return crow::response(200, response);
    });

    // Handle get events request for a specific user
    CROW_ROUTE(app, "/events/<string>").methods("GET"_method)([](const crow::request& req, const std::string& username) {
        std::ifstream inputFile("event.txt");
        if (!inputFile.is_open()) {
            return crow::response(400, "Unable to open event file.");
        }

        std::vector<crow::json::wvalue> events;
        std::string line;
        crow::json::wvalue event;

        while (std::getline(inputFile, line)) {
            if (line.find("Event Name: ") != std::string::npos) {
                event["eventName"] = line.substr(line.find(": ") + 2);
            } else if (line.find("Event Date: ") != std::string::npos) {
                event["eventDate"] = line.substr(line.find(": ") + 2);
            } else if (line.find("Event Venue: ") != std::string::npos) {
                event["eventVenue"] = line.substr(line.find(": ") + 2);
            } else if (line.find("Relevant SDGs: ") != std::string::npos) {
                event["eventSDGs"] = line.substr(line.find(": ") + 2);
            } else if (line.find("Event Objectives: ") != std::string::npos) {
                event["eventObjectives"] = line.substr(line.find(": ") + 2);
            } else if (line.find("Username: ") != std::string::npos) {
                std::string fileUsername = line.substr(line.find(": ") + 2);
                if (fileUsername == username) {
                    while (std::getline(inputFile, line)) {
                        if (line.find("Status: ") != std::string::npos) {
                            event["status"] = line.substr(line.find(": ") + 2);
                        } else if (line.find("CDMO: ") != std::string::npos) {
                            event["CDMO"] = line.substr(line.find(": ") + 2);
                        } else if (line.find("OSAAR: ") != std::string::npos) {
                            event["OSAAR"] = line.substr(line.find(": ") + 2);
                        } else if (line == "---------------------------") {
                            break;
                        }
                    }
                    events.push_back(event);
                }
            } else if (line == "---------------------------") {
                event = crow::json::wvalue();
            }
        }

        inputFile.close();

        crow::json::wvalue response;
        response["events"] = crow::json::wvalue::list(events.begin(), events.end());

        return crow::response(200, response);
    });

    CROW_ROUTE(app, "/events/calendar/<string>").methods("GET"_method)([](const crow::request& req, const std::string& username) {
        std::ifstream inputFile("event.txt");
        if (!inputFile.is_open()) {
            return crow::response(400, "Unable to open event file.");
        }

        std::vector<crow::json::wvalue> events;
        std::string line;
        crow::json::wvalue currentEvent;
        std::string status;

        while (std::getline(inputFile, line)) {
            if (line.find("Event Name: ") != std::string::npos) {
                currentEvent["eventName"] = line.substr(line.find(": ") + 2);
            } else if (line.find("Event Date: ") != std::string::npos) {
                currentEvent["eventDate"] = line.substr(line.find(": ") + 2);
            } else if (line.find("Event Venue: ") != std::string::npos) {
                currentEvent["eventVenue"] = line.substr(line.find(": ") + 2);
            } else if (line.find("Relevant SDGs: ") != std::string::npos) {
                currentEvent["eventSDGs"] = line.substr(line.find(": ") + 2);
            } else if (line.find("Event Objectives: ") != std::string::npos) {
                currentEvent["eventObjectives"] = line.substr(line.find(": ") + 2);
            } else if (line.find("Status: ") != std::string::npos) {
                status = line.substr(line.find(": ") + 2);
                if (status == "Approved") {
                    while (std::getline(inputFile, line)) {
                        if (line.find("CDMO: ") != std::string::npos) {
                            currentEvent["CDMO"] = line.substr(line.find(": ") + 2);
                        } else if (line.find("OSAAR: ") != std::string::npos) {
                            currentEvent["OSAAR"] = line.substr(line.find(": ") + 2);
                        } else if (line == "---------------------------") {
                            break;
                        }
                    }
                    events.push_back(currentEvent);
                }
            } else if (line == "---------------------------") {
                currentEvent = crow::json::wvalue();
                status.clear(); 
            }
        }

        inputFile.close();

        crow::json::wvalue response;
        response["events"] = crow::json::wvalue::list(events.begin(), events.end());

        return crow::response(200, response);
    });



    // Handle admin get events request
    CROW_ROUTE(app, "/events/admin/<string>").methods("GET"_method)([](const crow::request& req, const std::string& approvalType) {
        
        std::ifstream inputFile;
        if (approvalType == "CDMO") {
            inputFile.open("cdmoList.txt");
        } else if (approvalType == "OSAAR") {
            inputFile.open("osaarList.txt");
        }

        if (!inputFile.is_open()) {
            std::cout << "Unable to open event file." << std::endl;
            return crow::response(400, "Unable to open event file.");
        }

        std::vector<crow::json::wvalue> allEvents;
        std::string line, cdmoStatus, osaarStatus;
        crow::json::wvalue currentEvent;

        while (std::getline(inputFile, line)) {
            if (line.find("Event Name: ") != std::string::npos) {
                currentEvent["eventName"] = line.substr(line.find(": ") + 2);
            } else if (line.find("Event Date: ") != std::string::npos) {
                currentEvent["eventDate"] = line.substr(line.find(": ") + 2);
            } else if (line.find("Event Venue: ") != std::string::npos) {
                currentEvent["eventVenue"] = line.substr(line.find(": ") + 2);
            } else if (line.find("Event Objectives: ") != std::string::npos) {
                currentEvent["eventObjectives"] = line.substr(line.find(": ") + 2);
            } else if (line.find("Relevant SDGs: ") != std::string::npos) {
                currentEvent["eventSDGs"] = line.substr(line.find(": ") + 2);
            } else if (line.find("Username: ") != std::string::npos) {
                currentEvent["username"] = line.substr(line.find(": ") + 2);
            } else if (line.find("Status: ") != std::string::npos) {
                currentEvent["status"] = line.substr(line.find(": ") + 2);
            } else if (line.find("CDMO: ") != std::string::npos) {
                cdmoStatus = line.substr(line.find(": ") + 2);
                currentEvent["CDMO"] = cdmoStatus == "No" ? "No response yet" : cdmoStatus;
            } else if (line.find("OSAAR: ") != std::string::npos) {
                osaarStatus = line.substr(line.find(": ") + 2);
                currentEvent["OSAAR"] = osaarStatus == "No" ? "No response yet" : osaarStatus;
            } else if (line == "---------------------------") {
                if (!cdmoStatus.empty() && !osaarStatus.empty()) {
                    if (approvalType == "CDMO" && cdmoStatus == "No response yet") {
                        allEvents.push_back(currentEvent);
                    } else if (approvalType == "OSAAR" && osaarStatus == "No response yet") {
                        allEvents.push_back(currentEvent);
                    }
                }
                currentEvent = crow::json::wvalue();
                cdmoStatus.clear();
                osaarStatus.clear();
            }
        }

        if (!cdmoStatus.empty() && !osaarStatus.empty()) {
            if (approvalType == "CDMO" && cdmoStatus == "No response yet") {
                allEvents.push_back(currentEvent);
            } else if (approvalType == "OSAAR" && osaarStatus == "No response yet") {
                allEvents.push_back(currentEvent);
            }
        }

        inputFile.close();

        crow::json::wvalue response;
        response["events"] = crow::json::wvalue::list(allEvents.begin(), allEvents.end());

        return crow::response(200, response);
    });

    // Handle approve event request (POST request to approve an event)
    CROW_ROUTE(app, "/events/approve/<string>/<string>").methods("POST"_method)([&cdmoView, &osaarView, &orgView](const crow::request& req, const std::string& paramEventName, const std::string& userType) {
        std::string decodedEventName = urlDecode(paramEventName);

        if (userType == "CDMO") {
            cdmoView.loadEventsToQueue("cdmoList.txt");
        } else if (userType == "OSAAR") {
            osaarView.loadEventsToQueue("osaarList.txt");
        }

        orgView.loadEvents("event.txt");

        std::queue<Event> updatedQueue;  
        bool foundEventInQueue = false;
        bool foundEventInList = false;

        auto& currentView = (userType == "CDMO") ? cdmoView : osaarView;

        while (!currentView.eventQueue.empty()) {
            Event currentEvent = currentView.eventQueue.front();
            currentView.eventQueue.pop();
            if (currentEvent.name == decodedEventName) {
                foundEventInQueue = true;
                if (userType == "CDMO") {
                    currentEvent.CDMO = "Approved";
                } else if (userType == "OSAAR") {
                    currentEvent.OSAAR = "Approved";
                }
                if (currentEvent.CDMO == "Approved" && currentEvent.OSAAR == "Approved") {
                    currentEvent.status = "Approved";
                } else {
                    updatedQueue.push(currentEvent);
                }
            } else {
                updatedQueue.push(currentEvent);
            }
        }

        currentView.eventQueue = updatedQueue;

        Event* temp = orgView.head;
        while (temp != nullptr) {
            if (temp->name == decodedEventName) {
                foundEventInList = true;
                if (userType == "CDMO") {
                    temp->CDMO = "Approved";
                } else if (userType == "OSAAR") {
                    temp->OSAAR = "Approved";
                }
                if (temp->CDMO == "Approved" && temp->OSAAR == "Approved") {
                    temp->status = "Approved";
                }
                break;
            }
            temp = temp->next;
        }

        crow::json::wvalue response;
        if (foundEventInQueue && foundEventInList) {
            currentView.saveEventsFromQueue((userType == "CDMO") ? "cdmoList.txt" : "osaarList.txt");
            orgView.saveEvents("event.txt");
            response["success"] = true;
            response["message"] = "Event approved successfully";
        } else {
            response["success"] = false;
            response["message"] = "Event not found";
        }

        return crow::response(200, response);
    });

    // Handle deny event request (POST request to deny an event)
    CROW_ROUTE(app, "/events/deny/<string>/<string>").methods("POST"_method)([&cdmoView, &osaarView, &orgView](const crow::request& req, const std::string& paramEventName, const std::string& userType) {
        std::string decodedEventName = urlDecode(paramEventName);
        auto body = crow::json::load(req.body);
        if (!body) {
            return crow::response(400, "Invalid JSON");
        }

        std::string reason = body["reason"].s();
        if (userType == "CDMO") {
            cdmoView.loadEventsToQueue("cdmoList.txt");
        } else if (userType == "OSAAR") {
            osaarView.loadEventsToQueue("osaarList.txt");
        }

        orgView.loadEvents("event.txt");

        std::queue<Event> updatedQueue; 
        bool foundEventInQueue = false;
        bool foundEventInList = false;

        auto& currentView = (userType == "CDMO") ? cdmoView : osaarView;

        while (!currentView.eventQueue.empty()) {
            Event currentEvent = currentView.eventQueue.front();
            currentView.eventQueue.pop();
            if (currentEvent.name == decodedEventName) {
                foundEventInQueue = true;
                if (userType == "CDMO") {
                    currentEvent.CDMO = "Rejected: " + reason;
                } else if (userType == "OSAAR") {
                    currentEvent.OSAAR = "Rejected: " + reason;
                }
                currentEvent.status = "Rejected";
            } else {
                updatedQueue.push(currentEvent);
            }
        }

        currentView.eventQueue = updatedQueue;

        Event* temp = orgView.head;
        while (temp != nullptr) {
            if (temp->name == decodedEventName) {
                foundEventInList = true;
                if (userType == "CDMO") {
                    temp->CDMO = "Rejected: " + reason;
                } else if (userType == "OSAAR") {
                    temp->OSAAR = "Rejected: " + reason;
                }
                temp->status = "Rejected";
                break;
            }
            temp = temp->next;
        }

        crow::json::wvalue response;
        if (foundEventInQueue && foundEventInList) {
            currentView.saveEventsFromQueue((userType == "CDMO") ? "cdmoList.txt" : "osaarList.txt");
            orgView.saveEvents("event.txt");
            response["success"] = true;
            response["message"] = "Event denied successfully";
        } else {
            response["success"] = false;
            response["message"] = "Event not found";
        }

        return crow::response(200, response);
    });

    // Handle update event by name request (GET request to get event details)
    CROW_ROUTE(app, "/events/update/<string>").methods("GET"_method)
    ([&orgView](const crow::request& req, const std::string& paramEventName) {
        std::string decodedEventName = urlDecode(paramEventName);
        orgView.loadEvents("event.txt");

        Event* temp = orgView.head;
        crow::json::wvalue response;
        bool found = false;

        while (temp != nullptr) {
            if (temp->name == decodedEventName) {
                response["event"]["eventName"] = temp->name;
                response["event"]["eventDate"] = temp->date;
                response["event"]["eventVenue"] = temp->venue;
                response["event"]["eventObjectives"] = temp->objectives;
                response["event"]["eventSDGs"] = temp->SDGs;
                response["event"]["username"] = temp->username;
                response["event"]["status"] = temp->status;
                response["event"]["CDMO"] = temp->CDMO;
                response["event"]["OSAAR"] = temp->OSAAR;
                found = true;
                break;
            }
            temp = temp->next;
        }

        if (found) {
            response["success"] = true;
        } else {
            response["success"] = false;
            response["message"] = "Event not found";
        }

        return crow::response(200, response);
    });

    // Handle update event by name request (PUT request to update event details)
    CROW_ROUTE(app, "/events/update/<string>").methods("PUT"_method)([&cdmoView, &osaarView, &orgView](const crow::request& req, const std::string& paramEventName) {
        std::string decodedEventName = urlDecode(paramEventName);
        auto body = crow::json::load(req.body);
        if (!body) {
            return crow::response(400, "Invalid JSON");
        }

        std::string eventName = body["eventName"].s();
        std::string eventDate = body["eventDate"].s();
        std::string eventVenue = body["eventVenue"].s();
        std::string eventObjectives = body["eventObjectives"].s();
        std::string eventSDGs = body["eventSDGs"].s();
        std::string username = body["username"].s();

        cdmoView.loadEvents("cdmoList.txt");
        osaarView.loadEvents("osaarList.txt");
        orgView.loadEvents("event.txt");

        Event* current = cdmoView.head;
        Event* previous = nullptr;
        bool deletedInCdmoView = false;
        while (current != nullptr) {
            if (current->name == decodedEventName) {
                if (previous == nullptr) {
                    cdmoView.head = current->next;
                } else {
                    previous->next = current->next;
                }
                delete current;
                deletedInCdmoView = true;
                break;
            }
            previous = current;
            current = current->next;
        }

        current = osaarView.head;
        previous = nullptr;
        bool deletedInOsaarView = false;
        while (current != nullptr) {
            if (current->name == decodedEventName) {
                if (previous == nullptr) {
                    osaarView.head = current->next; 
                } else {
                    previous->next = current->next;
                }
                delete current;
                deletedInOsaarView = true;
                break;
            }
            previous = current;
            current = current->next;
        }

        Event* temp = orgView.head;
        bool foundInOrgView = false;

        while (temp != nullptr) {
            if (temp->name == decodedEventName) {
                temp->name = eventName;
                temp->date = eventDate;
                temp->venue = eventVenue;
                temp->objectives = eventObjectives;
                temp->SDGs = eventSDGs;
                temp->username = username;
                temp->CDMO = "No response yet";
                temp->OSAAR = "No response yet";
                temp->status = "Pending";
                foundInOrgView = true;
                break;
            }
            temp = temp->next;
        }

        crow::json::wvalue response;
        if (foundInOrgView) {
            cdmoView.saveEvents("cdmoList.txt");
            osaarView.saveEvents("osaarList.txt");
            orgView.saveEvents("event.txt");

            std::string cdmoResult = cdmoView.createEvent(eventName, eventDate, eventVenue, eventObjectives, eventSDGs, username, "CDMO");
            std::string osaarResult = osaarView.createEvent(eventName, eventDate, eventVenue, eventObjectives, eventSDGs, username, "OSAAR");

            if (cdmoResult != "done" || osaarResult != "done") {
                response["success"] = false;
                response["message"] = "Failed to create the event in cdmoView or osaarView.";
                return crow::response(600, response);
            }

            response["success"] = true;
            response["message"] = "Event updated successfully";
        } else {
            response["success"] = false;
            response["message"] = "Event not found in orgView.";
        }

        return crow::response(200, response);
    });

    // Handle delete event request
    CROW_ROUTE(app, "/events/delete/<string>").methods("DELETE"_method)([&cdmoView, &osaarView, &orgView](const crow::request& req, const std::string& paramEventName) {
        std::string decodedEventName = urlDecode(paramEventName);

        cdmoView.loadEvents("cdmoList.txt");
        osaarView.loadEvents("osaarList.txt");
        orgView.loadEvents("event.txt");

        Event* current = cdmoView.head;
        Event* previous = nullptr;
        while (current != nullptr) {
            if (current->name == decodedEventName) {
                if (previous == nullptr) {
                    cdmoView.head = current->next; 
                } else {
                    previous->next = current->next;
                }
                delete current;
                break;
            }
            previous = current;
            current = current->next;
        }

        current = osaarView.head;
        previous = nullptr;
        while (current != nullptr) {
            if (current->name == decodedEventName) {
                if (previous == nullptr) {
                    osaarView.head = current->next; 
                } else {
                    previous->next = current->next;
                }
                delete current;
                break;
            }
            previous = current;
            current = current->next;
        }

        current = orgView.head;
        previous = nullptr;
        bool foundInOrgView = false;
        while (current != nullptr) {
            if (current->name == decodedEventName) {
                if (previous == nullptr) {
                    orgView.head = current->next; 
                } else {
                    previous->next = current->next;
                }
                delete current;
                foundInOrgView = true;
                break;
            }
            previous = current;
            current = current->next;
        }

        crow::json::wvalue response;
        if (foundInOrgView) {
            cdmoView.saveEvents("cdmoList.txt");
            osaarView.saveEvents("osaarList.txt");
            orgView.saveEvents("event.txt");
            response["success"] = true;
            response["message"] = "Event deleted successfully";
        } else {
            response["success"] = false;
            response["message"] = "Event not found";
        }

        return crow::response(200, response);
    });


    app.port(8080).multithreaded().run();
}

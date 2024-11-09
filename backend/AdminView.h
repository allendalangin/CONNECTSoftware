#include <iostream>
#include <map>
#include <fstream>
#include <string>
#include <queue>
#include "Event.h"

#ifndef ADMINVIEW_H
#define ADMINVIEW_H

using namespace std;

class Pages;

class AdminView {
private:
    string eventName, eventDate, eventVenue, eventObjs, SDGs;

public:
    Event* head;
    queue<Event> eventQueue;
    AdminView() : head(nullptr) {}
    
    AdminView(Pages* p);
    
    string createEvent(string eventName, string eventDate, string eventVenue, string eventObjs, string SDGs, string username, string type) {
        string filePath;

        if (type == "CDMO") {
            filePath = "cdmoList.txt";
        } else if (type == "OSAAR") {
            filePath = "osaarList.txt";
        } else {
            return "Invalid type specified.";
        }

        ifstream inputFile(filePath);
        bool eventExists = false;

        if (inputFile.is_open()) {
            string line;
            while (getline(inputFile, line)) {
                if (line.find("Event Name: " + eventName) != string::npos) {
                    eventExists = true;
                    break;
                }
            }
            inputFile.close();
        } else {
            return "Failed to open the file.";
        }

        if (eventExists) {
            return "eventExists";
        } else {
            ofstream eventFile(filePath, ios::app);
            if (eventFile.is_open()) {
                eventFile << "---------------------------\n"
                          << "Event Name: " << eventName << "\n"
                          << "Event Date: " << eventDate << "\n"
                          << "Event Venue: " << eventVenue << "\n"
                          << "Event Objectives: " << eventObjs << "\n"
                          << "Relevant SDGs: " << SDGs << "\n"
                          << "Username: " << username << "\n"
                          << "Status: " << "Pending" << "\n"
                          << "CDMO: " << "No response yet" << "\n"
                          << "OSAAR: " << "No response yet" << "\n";
                eventFile.flush();
                eventFile.close();
                return "done";
            } else {
                return "Unable to open the file to save the event.";
            }
        }
    }

    void addEvent(const Event& newEvent) {
        Event* newNode = new Event(newEvent);
        if (head == nullptr) {
            head = newNode;
        } else {
            Event* temp = head;
            while (temp->next != nullptr) {
                temp = temp->next;
            }
            temp->next = newNode;
        }
    }

    void loadEvents(const string& filePath) {
        clearEvents();

        ifstream inputFile(filePath);
        if (!inputFile.is_open()) {
            cout << "Failed to open the file." << endl;
            return;
        }

        string line, name, date, venue, objectives, sdgs, username, status, cdmoComment, osaarComment;
        while (getline(inputFile, line)) {
            if (line == "---------------------------") {
                getline(inputFile, name);
                getline(inputFile, date);
                getline(inputFile, venue);
                getline(inputFile, objectives);
                getline(inputFile, sdgs);
                getline(inputFile, username);
                getline(inputFile, status);
                getline(inputFile, cdmoComment);
                getline(inputFile, osaarComment);

                name = name.substr(name.find(": ") + 2);
                date = date.substr(date.find(": ") + 2);
                venue = venue.substr(venue.find(": ") + 2);
                objectives = objectives.substr(objectives.find(": ") + 2);
                sdgs = sdgs.substr(sdgs.find(": ") + 2);
                username = username.substr(username.find(": ") + 2);
                status = status.substr(status.find(": ") + 2);
                cdmoComment = cdmoComment.substr(cdmoComment.find(": ") + 2);
                osaarComment = osaarComment.substr(osaarComment.find(": ") + 2);

                Event newEvent(name, date, venue, objectives, sdgs, username, status, cdmoComment, osaarComment);
                addEvent(newEvent);
            }
        }
        inputFile.close();
    }

    void loadEventsToQueue(const string& filePath) {
        while (!eventQueue.empty()) {
            eventQueue.pop();
        }

        ifstream inputFile(filePath);
        if (!inputFile.is_open()) {
            cout << "Failed to open the file." << endl;
            return;
        }

        string line, name, date, venue, objectives, sdgs, username, status, cdmoComment, osaarComment;

        while (getline(inputFile, line)) {
            if (line == "---------------------------") {
                if (getline(inputFile, line)) {
                    name = line.substr(line.find(": ") + 2);
                }
                if (getline(inputFile, line)) {
                    date = line.substr(line.find(": ") + 2);
                }
                if (getline(inputFile, line)) {
                    venue = line.substr(line.find(": ") + 2);
                }
                if (getline(inputFile, line)) {
                    objectives = line.substr(line.find(": ") + 2);
                }
                if (getline(inputFile, line)) {
                    sdgs = line.substr(line.find(": ") + 2);
                }
                if (getline(inputFile, line)) {
                    username = line.substr(line.find(": ") + 2);
                }
                if (getline(inputFile, line)) {
                    status = line.substr(line.find(": ") + 2);
                }
                if (getline(inputFile, line)) {
                    cdmoComment = line.substr(line.find(": ") + 2);
                }
                if (getline(inputFile, line)) {
                    osaarComment = line.substr(line.find(": ") + 2);
                }

                Event newEvent(name, date, venue, objectives, sdgs, username, status, cdmoComment, osaarComment);
                eventQueue.push(newEvent);
            }
        }
        inputFile.close();
    }

    void saveEventsFromQueue(const string& filePath) {
        ofstream outputFile(filePath);
        if (!outputFile.is_open()) {
            cout << "Error: Unable to open the file to save the events." << endl;
            return;
        }

        std::queue<Event> tempQueue = eventQueue;

        while (!tempQueue.empty()) {
            Event current = tempQueue.front();
            tempQueue.pop();

            outputFile << "---------------------------\n"
                       << "Event Name: " << current.name << "\n"
                       << "Event Date: " << current.date << "\n"
                       << "Event Venue: " << current.venue << "\n"
                       << "Event Objectives: " << current.objectives << "\n"
                       << "Relevant SDGs: " << current.SDGs << "\n"
                       << "Username: " << current.username << "\n"
                       << "Status: " << current.status << "\n"
                       << "CDMO: " << current.CDMO << "\n"
                       << "OSAAR: " << current.OSAAR << "\n";
        }

        outputFile.close();
    }

    void saveEvents(const string& filePath) {
        ofstream outputFile(filePath);
        if (!outputFile.is_open()) {
            cout << "Error: Unable to open the file to save the events." << endl;
            return;
        }

        Event* current = head;
        while (current != nullptr) {
            outputFile << "---------------------------\n"
                       << "Event Name: " << current->name << "\n"
                       << "Event Date: " << current->date << "\n"
                       << "Event Venue: " << current->venue << "\n"
                       << "Event Objectives: " << current->objectives << "\n"
                       << "Relevant SDGs: " << current->SDGs << "\n"
                       << "Username: " << current->username << "\n"
                       << "Status: " << current->status << "\n"
                       << "CDMO: " << current->CDMO << "\n"
                       << "OSAAR: " << current->OSAAR << "\n";
            current = current->next;
        }
        outputFile.close();
    }

    void clearEvents() {
        Event* current = head;
        while (current != nullptr) {
            Event* nextNode = current->next;
            delete current;
            current = nextNode;
        }
        head = nullptr;
    }

    string editEvent(const string& editName, const string& newName, const string& newDate, const string& newVenue, const string& newObjectives, const string& newSDGs) {
        Event* current = head;
        while (current != nullptr) {
            if (current->name == editName) {
                current->name = newName;
                current->date = newDate;
                current->venue = newVenue;
                current->objectives = newObjectives;
                current->SDGs = newSDGs;
                current->status = "Pending";
                current->CDMO = "";
                current->OSAAR = "";
                return "done";
            }
            current = current->next;
        }
        return "notFound";
    }

    string deleteEvent(const string& deleteName) {
        if (head == nullptr) {
            return "notFound";
        }

        Event* current = head;
        Event* previous = nullptr;

        while (current != nullptr && current->name != deleteName) {
            previous = current;
            current = current->next;
        }

        if (current == nullptr) {
            return "notFound";
        }

        if (current == head) {
            head = head->next;
        } else {
            previous->next = current->next;
        }

        delete current;
        return "done";
    }

    ~AdminView() {
        clearEvents();
    }
};

#endif

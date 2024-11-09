#include <iostream>
#include <map>
#include <fstream>
#include <string>
#include "Event.h"

#ifndef ORGVIEW_H
#define ORGVIEW_H

using namespace std;

class Pages;

class OrgView {
private: 
    string eventName, eventDate, eventVenue, eventObjs, SDGs;
public: 
    Event* head;
    OrgView(): head(nullptr) {}
    
    OrgView(Pages* p);
    
    
    string createEvent(string eventName, string eventDate, string eventVenue, string eventObjs, string SDGs, string username) {
        ifstream inputFile("event.txt");
        bool eventExists = false;

        if (inputFile.is_open()) {
            string line;
            while (getline(inputFile, line)) {
                if (line == "Event Name: " + eventName) {
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
            ofstream eventFile("event.txt", ios::app);
            if (eventFile.is_open()) {
                eventFile << "---------------------------\n" 
                        << "Event Name: " << eventName << "\n"
                        << "Event Date: " << eventDate << "\n"
                        << "Event Venue: " << eventVenue << "\n"
                        << "Event Objectives: " << eventObjs << "\n"
                        << "Relevant SDGs: " << SDGs << "\n"
                        << "Username: " << username << "\n"
                        << "Status: " << "Pending" << "\n"
                        << "CDMO: " << "No response yet"<< "\n"
                        << "OSAAR: " << "No response yet" << "\n";
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

    void saveEvents(const string& filePath) {
        ofstream outputFile(filePath);
        if (!outputFile.is_open()) {
            cout << "Error: Unable to open the file to save the events." << endl;
            return;
        }

        Event* temp = head;
        while (temp != nullptr) {
            outputFile << "---------------------------\n"
                    << "Event Name: " << temp->name << "\n"
                    << "Event Date: " << temp->date << "\n"
                    << "Event Venue: " << temp->venue << "\n"
                    << "Event Objectives: " << temp->objectives << "\n"
                    << "Relevant SDGs: " << temp->SDGs << "\n"
                    << "Username: " << temp->username << "\n"
                    << "Status: " << temp->status << "\n"
                    << "CDMO: " << temp->CDMO << "\n"
                    << "OSAAR: " << temp->OSAAR << "\n";
            temp = temp->next;
        }
        outputFile.close();

        clearEvents();
    }



    // Function to edit an event by changing the details if the event is found
    string editEvent(const string& editName, const string& newName, const string& newDate, const string& newVenue, const string& newObjectives, const string& newSDGs) {
        Event* temp = head;

        while (temp != nullptr) {
            if (temp->name == editName) {
                temp->name = newName;
                temp->date = newDate;
                temp->venue = newVenue;
                temp->objectives = newObjectives;
                temp->SDGs = newSDGs;
                temp->status = "Pending";
                temp->CDMO = "";
                temp->OSAAR = "";
                
                cout << "Event edited successfully!" << endl;
                return "done";
            }
            temp = temp->next;
        }

        return "notFound";
    }

    // Function to delete an event by name
    string deleteEvent(const string& eventName) {
        Event* temp = head;
        Event* prev = nullptr;

        while (temp != nullptr) {
            if (temp->name == eventName) {
                if (prev == nullptr) {
                    head = temp->next;
                } else {
                    prev->next = temp->next;
                }
                delete temp;
                cout << "Event deleted successfully!" << endl;
                return "done";
            }
            prev = temp;
            temp = temp->next;
        }

        return "notFound";
    }


    // Destructor to free memory
    ~OrgView() {
        Event* current = head;
        while (current != nullptr) {
            Event* next = current->next;
            delete current;
            current = next;
        }
    }

    void clearEvents() {
        while (head != nullptr) {
            Event* next = head->next;
            delete head;
            head = next;
        }
    }

};

#endif
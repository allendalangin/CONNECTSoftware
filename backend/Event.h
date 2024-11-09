#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <algorithm>
using namespace std;

#ifndef EVENT_H
#define EVENT_H

struct Event {
    string name;
    string date;
    string venue;
    string objectives;
    string SDGs;
    string username;
    string status;
    string CDMO;
    string OSAAR;

    Event* next;  // Pointer to the next node in the linked list

    Event() : name(""), date(""), venue(""), objectives(""), SDGs(""), username(""), status("Pending"), CDMO(""), OSAAR(""), next(nullptr) {}

    Event(const string& name, const string& date, const string& venue, const string& objectives, const string& SDGs, const string& username, const string& status, const string& CDMO, const string& OSAAR)
        : name(name), date(date), venue(venue), objectives(objectives), SDGs(SDGs), username(username), status(status), CDMO(CDMO), OSAAR(OSAAR), next(nullptr) {}
};

#endif

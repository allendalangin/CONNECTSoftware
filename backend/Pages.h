#include <iostream>
#include <map>
#include <fstream>
#include <string>
#include <cctype>
#include "OrgView.h"
using namespace std; 

#ifndef PAGES_H
#define PAGES_H

class OrgView;

class Pages {
private: 
    string name, username, password; 
    string inputUN, inputPW;
    string fileUN, filePW;
    int choice1, choice2;
    string domainOrg = "@org.mapua"; 
    string domainOSAAR = "@osaar.mapua"; 
    string domainCDMO = "@cdmo.mapua"; 
    OrgView orgView; 
public:
    Pages() {}
    
    string signUp(string username, string password, string classification){ 
        string signUpState;

            if (classification == "Org") {
                username = username.append(domainOrg);
            } else if (classification == "OSAAR") {
                username = username.append(domainOSAAR);
            } else if (classification == "CDMO") {
                username = username.append(domainCDMO);
            } else {
                return "noType";
            }
            
            if (isUsernameTaken(username)) {
                signUpState = "takenUser";
            } 
            // Check if the password is valid
            else if (!isValidPassword(password)) {
                signUpState = "invalidPass";
            } 

            else {
                ofstream outFile("account.txt", ios::app);
                
                if (outFile.is_open()) {
                    outFile << username << " " << password << endl;
                    outFile.close();
                    signUpState = "done";
                } else {
                    cerr << "Unable to open file for writing." << endl;
                    signUpState = "error";
                }
            }

            return signUpState;
        }
                  

    bool isValidPassword(const std::string& password) {
        bool hasUppercase = false;
        bool hasLowercase = false;
        bool hasDigit = false;

        for (char ch : password) {
            if (std::isupper(ch)) {
                hasUppercase = true;
            }
            if (std::islower(ch)) {
                hasLowercase = true;
            }
            if (std::isdigit(ch)) {
                hasDigit = true;
            }

            if (hasUppercase && hasLowercase && hasDigit) {
                return true;
            }
        }

        return false;
    }

    bool isUsernameTaken(const string& username) {
        ifstream inFile("account.txt"); 
        if (!inFile.is_open()) {
            cerr << "Unable to open file for reading." << endl; 
            return true;
        }
        
        string fileUN, filePW;
        while (inFile >> fileUN >> filePW) {
            if (fileUN == username) {
                inFile.close();
                return true;
            }
        }
        inFile.close();
        return false;
    }

string orgLogIn(string username, string password) {
    string loginState = "false";
        ifstream inFile("account.txt"); 
 
        if (!inFile.is_open()) {
            cerr << "Unable to open file for reading." << endl; 
            return loginState; 
        }
        while (inFile >> fileUN >> filePW) {
            if(fileUN.find("@org.mapua") != string::npos) {
                if (username == fileUN && password == filePW) {
                    loginState = "true";
                    break; 
                }
            }
        }

        inFile.close();

        return loginState;
    }

    string cdmoLogIn(string username, string password) {
    string loginState = "false";
        ifstream inFile("account.txt"); 
 
        if (!inFile.is_open()) {
            cerr << "Unable to open file for reading." << endl; 
            return loginState; 
        }
        while (inFile >> fileUN >> filePW) {
            if(fileUN.find("@cdmo.mapua") != string::npos) {
                if (username == fileUN && password == filePW) {
                    loginState = "true";
                    break; 
                }
            }
        }

        inFile.close();

        return loginState;
    }

    string osaarLogIn(string username, string password) {
    string loginState = "false";
        ifstream inFile("account.txt"); 
 
        if (!inFile.is_open()) {
            cerr << "Unable to open file for reading." << endl; 
            return loginState; 
        }
        while (inFile >> fileUN >> filePW) {
            if(fileUN.find("@osaar.mapua") != string::npos) {
                if (username == fileUN && password == filePW) {
                    loginState = "true";
                    break; 
                }
            }
        }

        inFile.close();

        return loginState;
    }
};

#endif
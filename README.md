# CONNECTSoftware

## Setup Instructions

1. **Clone the repository** int the `zip` branch.

2. **Backend Setup**:
   - Navigate to the `backend` folder in the terminal.
   - If the `CrowApp.exe` file is already present, run the following command:
     ```
     ./CrowApp.exe
     ```
     *(Note: OpenSSL might be required.)*

   - The backend may require `GCC` or `g++` compiler and `vcpkg` library
     
   - If `CrowApp.exe` does not exist, you'll need to build the backend:
     - First, run the following commands to generate the build files:
       ```
       cmake -S . -B build
       ```
     - Then, build the project:
       ```
       cmake --build build
       ```
     *(Note: You may need to exclude the `.exe` file from antivirus software, as it may get quarantined.)*

3. **Frontend Setup**:
   - Navigate to the `frontend` folder in the terminal.
   - Make sure **Node.js** is installed.
   - Run the following command to start the frontend:
     ```
     npm run dev
     ```

4. **Run the Application**:
   - Once both backend (`CrowApp.exe`) and frontend (`npm run dev`) are running, the application should be up and accessible.

---

### Notes:
- Ensure that you have **OpenSSL** installed if required by the backend.
- If you encounter issues with the `.exe` file being quarantined, temporarily disable antivirus software or configure it to allow the file.

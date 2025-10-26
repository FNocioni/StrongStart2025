# StrongStart2025

> A spending tracker application for CS100 StrongStart2025 project

## Authors
- Federico (Mentor)
- Jack
- eloy
- Danish
- Jinwoo

## Sections
- [Top of page](#strongstart2025)
- [Authors](#authors)
- [Sections](#sections)
- [Preview and screenshots](#preview)
- [Installation and running server on localhost](#running-server-on-localhost)

## Preview

![loginPage](md/loginPage.png)

![aboutPage](md/aboutPage.png)

## Running server on localhost

1. Make sure you have `node` and `npm` installed on your machine

    On arch-linux based distros:
    ```shell
    sudo pacman -S nodejs npm
    ```


    On MacOS/OSX, assuming you have the [brew package manager](https://brew.sh/) installed, run:
    ```shell
    brew install node
    ```


    On Windows Devices, either visit the [nodejs download](https://nodejs.org/en/download) page,
    and run the installer, or install using `winget` on newer versions of Windows by running:
    ```powershell
    winget install -e --id OpenJS.NodeJS
    ```

2. Ensure `node` and `npm` are both in PATH environment variable after installation

    The following should yield some sort of output resembling a version number:
    ```shell
    node --version
    npm --version
    ```


    Example output:
    ```
    v24.8.0
    11.6.0
    ```

3. Clone the repository and cd into it

    > The following command should be run in the [git-bash](https://git-scm.com/install/windows) terminal for Windows
    ```shell
    git clone https://github.com/FNocioni/StrongStart2025 && cd StrongStart2025
    ```

4. Install server dependencies

    ```shell
    npm install
    ```


    Create a `.env` file in the project root and ensure that the correct credentials are in the file,
    in the following text format:
    ```
    DB_HOST=database_host_url_goes_here
    DB_USER=database_login_username_goes_here
    DB_PASS=database_login_password_goes_here
    DB_PORT=database_port_goes_here
    DB_NAME=database_default_database_target
    ```

5. Start the server

    ```shell
    npm start
    ```

6. Connect to localhost web server via browser

    On Linux, via chromium
    ```shell
    chromium 'http://localhost:5000'
    ```


    On any other OS, open a Modern web-browser and go to the url: <http://localhost:5000>

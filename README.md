# StrongStart2025

## Authors
- Federico (Mentor)
- Jack
- eloy
- Danish
- Jinwoo

# Running server on localhost

1. Make sure you have `node` and `npm` installed on your machine
On arch-linux based distros:
```bash
sudo pacman -S nodejs npm
```

On MacOS/OSX, assuming you have the [brew package manager](https://brew.sh/) installed, run:
```bash
brew install node
```

On Windows Devices, either visit the [nodejs download](https://nodejs.org/en/download) page,
and run the installer, or install using `winget` on newer versions of Windows by running:
```powershell
winget install -e --id OpenJS.NodeJS
```

2. Ensure `node` and `npm` are both in PATH environment variable after installation

The following should yield some sort of output resembling a version number:
```bash
node --version
npm --version
```

Example output:
```
v24.8.0
11.6.0
```

3. Install server dependencies

```bash
npm install
```

4. Start the server

```bash
npm start
```

5. Connect to localhost web server via browser

On Linux, via chromium
```bash
chromium 'http://localhost:5000'
```

On anything else, open a modern-webbrowser and go to the url: [](http://localhost:5000)

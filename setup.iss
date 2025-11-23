
[Setup]
AppName=Sistema Gestión de Bebidas
AppVersion=1.0.0
AppPublisher=Ricardo Ugarte
DefaultDirName={{autopf}}\SistemaGestionBebidas
DefaultGroupName=Sistema Gestión Bebidas
OutputDir=dist
OutputBaseFilename=InstaladorSistemaBebidas
SetupIconFile=icon.ico
Compression=lzma
SolidCompression=yes
PrivilegesRequired=lowest

[Languages]
Name: "spanish"; MessagesFile: "compiler:Languages\Spanish.isl"

[Tasks]
Name: "desktopicon"; Description: "Crear icono en el escritorio"; GroupDescription: "Accesos directos:"

[Files]
Source: "SistemaGestionBebidas.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "server.js"; DestDir: "{app}"; Flags: ignoreversion
Source: "package.json"; DestDir: "{app}"; Flags: ignoreversion
Source: "node_modules\*"; DestDir: "{app}\node_modules"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\Sistema Gestión Bebidas"; Filename: "{app}\SistemaGestionBebidas.exe"
Name: "{autodesktop}\Sistema Gestión Bebidas"; Filename: "{app}\SistemaGestionBebidas.exe"; Tasks: desktopicon

[Run]
Filename: "{app}\SistemaGestionBebidas.exe"; Description: "Ejecutar Sistema Gestión Bebidas"; Flags: nowait postinstall skipifsilent

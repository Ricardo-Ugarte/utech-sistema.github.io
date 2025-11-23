Set ws = CreateObject("WScript.Shell")
desktopPath = ws.SpecialFolders("Desktop")

Set link = ws.CreateShortcut(desktopPath & "\Sistema Gestion Bebidas.lnk")
link.TargetPath = ws.CurrentDirectory & "\Iniciar Sistema.bat"
link.WorkingDirectory = ws.CurrentDirectory
link.Description = "Sistema de Gestion de Bebidas"
link.Save

MsgBox "Acceso directo creado en el escritorio: Sistema Gestion Bebidas.lnk", vbInformation, "Listo"
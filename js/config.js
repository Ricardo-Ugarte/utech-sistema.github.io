// Configuración segura para el ejecutable
const fs = require('fs');
const path = require('path');

class ConfigManager {
  constructor() {
    this.configPath = path.join(process.cwd(), 'config.json');
    this.defaultConfig = {
      PORT: 3000,
      AZURE_SQL_HOST: 'servernuevo.database.windows.net',
      AZURE_SQL_DATABASE: 'pagadatabase',
      AZURE_SQL_USER: 'CloudSAf5971fd4',
      AZURE_SQL_PORT: 1433
    };
  }

  loadConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        const savedConfig = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
        return { ...this.defaultConfig, ...savedConfig };
      }
    } catch (error) {
      console.log('⚠️  Usando configuración por defecto');
    }
    return this.defaultConfig;
  }

  saveConfig(newConfig) {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(newConfig, null, 2));
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new ConfigManager();
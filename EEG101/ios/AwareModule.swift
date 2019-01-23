import AWAREFramework
import os

@objc(AwareModule)
final class AwareModule: NSObject {
  
  private var muse: IXNMuse?
  private var museSensorAccelerometer: MuseSensorAccelerometer?
  private var museSensorDrlRef: MuseSensorDrlRef?
  private var museSensorEeg: MuseSensorEeg?
  private var museSensorGyro: MuseSensorGyro?
  private var museSensorHsi: MuseSensorHsi?
  private var museSensorHsiPrecision: MuseSensorHsiPrecision?
  private var museSensorIsGood: MuseSensorIsGood?
  
  override init() {
    super.init()
    
    os_log("bridge/swift: AwareModule#init")
  }
  
  @objc(startAware)
  func startAware() {
    // This function is called once user has logged in.

    // Use our own xcdatamodel/momd instead of aware one so we can add new
    // sqlite tables for the home-made eeg sensor etc.
    let momdUrl = Bundle.main.url(forResource: "MuseAwareSensor", withExtension: "momd")
    ExternalCoreDataHandler.shared()!.overwriteManageObjectModel(withFileURL: momdUrl)
    let sqliteURL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).last
    ExternalCoreDataHandler.shared()!.sqliteFileURL = sqliteURL!.appendingPathComponent("MuseAwareSensor.sqlite") // @todo @warning make sure sqlite db exists!
    
    // Set local db encryption keys.
    let encryptionKey = kFluxIosEncryptionKey
    CoreDataHandler.shared()!.sqliteEncryptionKey = encryptionKey;
    ExternalCoreDataHandler.shared()!.sqliteEncryptionKey = encryptionKey;
    
    // Request notification & sensing permissions
    let core = AWARECore.shared()
    DispatchQueue.main.async {
      core!.requestPermissionForBackgroundSensing()
      core!.requestPermissionForPushNotification()
      
      DispatchQueue.global(qos: .background).async {
        core!.activate()

        // SAMPLE CODE: For adding a study URL directly.
        let url = "https://api.awareframework.com/index.php/webservice/index/1939/lA3beuWw3aYD"
        
        let manager = AWARESensorManager.shared()
        #if DEBUG
        manager!.setDebugToAllSensors(true)
        manager!.setDebugToAllStorage(true)
        #else
        manager!.setDebugToAllSensors(false)
        manager!.setDebugToAllStorage(false)
        #endif
        
        let study = AWAREStudy.shared()
        #if DEBUG
        study!.setDebug(true)
        #else
        study!.setDebug(false)
        #endif
        
        study!.setAutoDBSyncOnlyWifi(true)
        study!.setAutoDBSyncOnlyBatterChargning(true)
        study!.setAutoDBSync(true)
        
        study!.join(withURL: url, completion: { (settings, studyState, error) in
          // Add study sensors
          manager!.addSensors(with: study)
          
          // Add EEG sensors
          self.museSensorAccelerometer = MuseSensorAccelerometer(awareStudy: study!, dbType: AwareDBTypeSQLite)
          self.museSensorDrlRef = MuseSensorDrlRef(awareStudy: study!, dbType: AwareDBTypeSQLite)
          self.museSensorEeg = MuseSensorEeg(awareStudy: study!, dbType: AwareDBTypeSQLite)
          self.museSensorGyro = MuseSensorGyro(awareStudy: study!, dbType: AwareDBTypeSQLite)
          self.museSensorHsi = MuseSensorHsi(awareStudy: study!, dbType: AwareDBTypeSQLite)
          self.museSensorHsiPrecision = MuseSensorHsiPrecision(awareStudy: study!, dbType: AwareDBTypeSQLite)
          self.museSensorIsGood = MuseSensorIsGood(awareStudy: study!, dbType: AwareDBTypeSQLite)
          
          manager!.add(self.museSensorAccelerometer)
          manager!.add(self.museSensorDrlRef)
          manager!.add(self.museSensorEeg)
          manager!.add(self.museSensorGyro)
          manager!.add(self.museSensorHsi)
          manager!.add(self.museSensorHsiPrecision)
          manager!.add(self.museSensorIsGood)
          
          // Start study
          manager!.startAllSensors()
        });
        
        // @note shouldn't be necessary as we activate aware's AUTO SYNC DB in
        // appdelegate, should take time to check aware source code.
        manager!.startAutoSyncTimer()
      }
    }
  }
  
  @objc(startPluginAndRecording)
  func startPluginAndRecording() {
    // @todo rename ?
    
    // retrieve current muse instance & start recording with it
    os_log("bridge/swift: AwareModule#startPluginAndRecording")
    self.muse = MuseConnectionManagerImpl.sharedInstance.getConnectedMuse()

    self.museSensorAccelerometer!.startRecording(muse: muse!)
    self.museSensorDrlRef!.startRecording(muse: muse!)
    self.museSensorEeg!.startRecording(muse: muse!)
    self.museSensorGyro!.startRecording(muse: muse!)
    self.museSensorHsi!.startRecording(muse: muse!)
    self.museSensorHsiPrecision!.startRecording(muse: muse!)
    self.museSensorIsGood!.startRecording(muse: muse!)
  }
  
  @objc(stopPluginAndRecording)
  func stopPluginAndRecording() {
    // @warning stopping plugin that late may block date transfer
    // @todo check if data are sent correctly
    os_log("bridge/swift: AwareModule#stopPluginAndRecording")
    self.museSensorAccelerometer!.stopRecording()
    self.museSensorDrlRef!.stopRecording()
    self.museSensorEeg!.stopRecording()
    self.museSensorGyro!.stopRecording()
    self.museSensorHsi!.stopRecording()
    self.museSensorHsiPrecision!.stopRecording()
    self.museSensorIsGood!.stopRecording()
    
    let manager = AWARESensorManager.shared()
    let study = AWAREStudy.shared()

    self.museSensorAccelerometer!.createTable()
    self.museSensorDrlRef!.createTable()
    self.museSensorEeg!.createTable()
    self.museSensorGyro!.createTable()
    self.museSensorHsi!.createTable()
    self.museSensorHsiPrecision!.createTable()
    self.museSensorIsGood!.createTable()
    
    manager!.syncAllSensorsForcefully()
    
    
    self.museSensorAccelerometer = nil
    self.museSensorDrlRef = nil
    self.museSensorEeg = nil
    self.museSensorGyro = nil
    self.museSensorHsi = nil
    self.museSensorHsiPrecision = nil
    self.museSensorIsGood = nil

    self.muse = nil
  }
  
}



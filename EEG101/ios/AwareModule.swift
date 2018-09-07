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
    
    // Hmmmmm...
    // start MuseSensor
    let manager = AWARESensorManager.shared()
    let study = AWAREStudy.shared()

    self.museSensorAccelerometer = MuseSensorAccelerometer(awareStudy: study!, dbType: AwareDBTypeSQLite)
    self.museSensorDrlRef = MuseSensorDrlRef(awareStudy: study!, dbType: AwareDBTypeSQLite)
    self.museSensorEeg = MuseSensorEeg(awareStudy: study!, dbType: AwareDBTypeSQLite)
    self.museSensorGyro = MuseSensorGyro(awareStudy: study!, dbType: AwareDBTypeSQLite)
    self.museSensorHsi = MuseSensorHsi(awareStudy: study!, dbType: AwareDBTypeSQLite)
    self.museSensorHsiPrecision = MuseSensorHsiPrecision(awareStudy: study!, dbType: AwareDBTypeSQLite)
    self.museSensorIsGood = MuseSensorIsGood(awareStudy: study!, dbType: AwareDBTypeSQLite)

    manager!.add(museSensorAccelerometer)
    manager!.add(museSensorDrlRef)
    manager!.add(museSensorEeg)
    manager!.add(museSensorGyro)
    manager!.add(museSensorHsi)
    manager!.add(museSensorHsiPrecision)
    manager!.add(museSensorIsGood)
    manager!.startAllSensors()
    
    // @note shouldn't be necessary as we activate aware's AUTO SYNC DB in
    // appdelegate, should take time to check aware source code.
    manager!.startAutoSyncTimer()
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



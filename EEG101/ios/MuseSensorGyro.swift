import Foundation
import AWAREFramework
// import Muse
import os

open class MuseSensorGyro: AWARESensor {
  static private let sensorName: String = "muse_gyro"
  static private let entityName: String = "EntityMuseGyro"
  
  private var isRecording: Bool = false
  var stream: MuseStreamGyro?
  
  public override init() {
    super.init() // @note this breaks except if overriden dbType
  }
  
  public override init(awareStudy: AWAREStudy, dbType: AwareDBType) {
    // This method variation has to be overriden has it is called from
    // super.init() and throws by default.
    
    let insertEntityCallback: InsertEntityCallBack = { dataDict, context, entity in
      let entityD = NSEntityDescription.entity(forEntityName: entity!, in: context!)
      let museData = NSManagedObject(entity: entityD!, insertInto: context!)
      museData.setValue(dataDict!["device_id"], forKey: "device_id")
      museData.setValue(dataDict!["timestamp"], forKey: "timestamp")
      museData.setValue(dataDict!["x"], forKey: "double_x")
      museData.setValue(dataDict!["y"], forKey: "double_y")
      museData.setValue(dataDict!["z"], forKey: "double_z")

      return
    }

    // we dont set insertEntityCallback as we do not use storage#saveData but
    // do it manual way instead
    // let insertEntityCallback: InsertEntityCallBack? = nil
    let storage: AWAREStorage = SQLiteStorage.init(study: awareStudy, sensorName: MuseSensorGyro.sensorName, entityName: MuseSensorGyro.entityName, dbHandler: ExternalCoreDataHandler.shared(), insertCallBack: insertEntityCallback)

    // Prevent aware internal buffer as we already use our own ring buffer
    storage.setBufferSize(1)
    
    // Call new official initializer
    super.init(awareStudy: awareStudy, sensorName: MuseSensorGyro.sensorName, storage: storage)
  }

  open override func startSensor() -> Bool {
    // Nothing to be done in this case.
    // We use manual startRecording method instead of start sensor so we can
    // add a parameter & be sure sync stays active when recording is stopped.
    super.startSensor()
    
    return true
  }
  open override func stopSensor() -> Bool {
    // Nothing to be done in this case.
    super.stopSensor()
    
    return true
  }

  open func startRecording(muse: IXNMuse) {
    do {
      print(muse.getMacAddress())
      
      self.stream = MuseStreamGyro(muse: muse)
      let stream = self.stream!

      
      // block queue ! have to do this on external thread
      // @todo build a queue on its own ?
      DispatchQueue.global(qos: .background).async {
        stream.start()
        self.isRecording = true
        
        while self.isRecording == true || !stream.isEmpty() {
          if let packet: IXNMuseDataPacket = stream.consume() {
            // @warning @todo we can batch insert with saveDataWithArray
            // instead.
            
            // @note buffer parameter is currently unused by aware (see storage
            // source code), to ensure no buffer, we use
            // storage.setBufferSize(1) at storage init
            self.storage.saveData(with: [
              "device_id": self.getDeviceId(),
              "timestamp": packet.timestamp(),
              "x": packet.getGyroValue(IXNGyro.X),
              "y": packet.getGyroValue(IXNGyro.Y),
              "z": packet.getGyroValue(IXNGyro.Z),
              ], buffer: false, saveInMainThread: false)
          }
          else {
            sleep(1)
          }
        }
        
        DispatchQueue.main.async {
          let _ = self.stopSensor()
        }
      }

    }
    catch {
      // @todo
      assertionFailure("something went wrong")
    }

  }
  open func stopRecording() {
    // self.record == nil if muse has not been able to connect - clean
    // record if it has
    if self.stream != nil {
      self.stream!.stop()
      self.stream = nil
      self.isRecording = false
    }
  }
  
  open override func createTable() {
    if self.isDebug() {
      os_log("[%@] Create Table", MuseSensorGyro.sensorName);
    }
    
    self.storage.createDBTableOnServer(withQuery: """
            _id integer primary key autoincrement,
            timestamp real default 0,
            device_id text default '',
            double_x real default 0
            double_y real default 0
            double_z real default 0
            """)
  }
  
}
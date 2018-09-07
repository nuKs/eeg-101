import Foundation
import AWAREFramework
// import Muse
import os

open class MuseSensorIsGood: AWARESensor {
  static private let sensorName: String = "muse_isgood"
  static private let entityName: String = "EntityMuseIsGood"
  
  private var isRecording: Bool = false
  var stream: MuseStreamIsGood?
  
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
      museData.setValue(dataDict!["eeg_1"], forKey: "double_eeg_1")
      museData.setValue(dataDict!["eeg_2"], forKey: "double_eeg_2")
      museData.setValue(dataDict!["eeg_3"], forKey: "double_eeg_3")
      museData.setValue(dataDict!["eeg_4"], forKey: "double_eeg_4")

      return
    }

    // we dont set insertEntityCallback as we do not use storage#saveData but
    // do it manual way instead
    // let insertEntityCallback: InsertEntityCallBack? = nil
    let storage: AWAREStorage = SQLiteStorage.init(study: awareStudy, sensorName: MuseSensorIsGood.sensorName, entityName: MuseSensorIsGood.entityName, dbHandler: ExternalCoreDataHandler.shared(), insertCallBack: insertEntityCallback)

    // Prevent aware internal buffer as we already use our own ring buffer
    storage.setBufferSize(1)
    
    // Call new official initializer
    super.init(awareStudy: awareStudy, sensorName: MuseSensorIsGood.sensorName, storage: storage)
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
      
      self.stream = MuseStreamIsGood(muse: muse)
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
              "eeg_1": packet.getEegChannelValue(IXNEeg.EEG1),
              "eeg_2": packet.getEegChannelValue(IXNEeg.EEG2),
              "eeg_3": packet.getEegChannelValue(IXNEeg.EEG3),
              "eeg_4": packet.getEegChannelValue(IXNEeg.EEG4),
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
      os_log("[%@] Create Table", MuseSensorIsGood.sensorName);
    }
    
    self.storage.createDBTableOnServer(withQuery: """
            _id integer primary key autoincrement,
            timestamp real default 0,
            device_id text default '',
            double_eeg_1 real default 0
            double_eeg_2 real default 0
            double_eeg_3 real default 0
            double_eeg_4 real default 0
            """)
  }
  
}

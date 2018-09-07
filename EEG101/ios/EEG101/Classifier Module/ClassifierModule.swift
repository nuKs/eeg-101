import os
import UIKit

@objc(ClassifierModule)
final class ClassifierModule: NSObject {
    public var museManager: MuseManager
    public var eventEmitter: EventEmitter
    
    private let dataListenersKeys = [
        /* status */
        IXNMuseDataPacketType.battery,
        // Muse headband battery data packet. This packet provides 3 pieces
        // of data.
        
        // Good indicates whether or not the last 1 second of raw EEG data
        // on each channel was good or not. Eye blinks or muscle movement
        // can interfere with EEG data and cause Is Good to report that the
        // data is not good. This is emitted every 1/10 of a second to
        // represent the rolling window of the last second of EEG data.
        // This is only useful for real time EEG analysis. This packet only
        // contains 4 values for the 4 sensors on the headband, there is
        // no support for the auxillary channels.
        IXNMuseDataPacketType.isGood,
        
        // Each channel represents the fit at that location. A value of 1 represents a good fit, 2 represents a mediocre fit, and a value or 4 represents a poor fit.
        IXNMuseDataPacketType.hsiPrecision,
        
        /* data */
        
        // Artifacts packet type will be sent.
        // Note that this will result in your listener receiving
        // IXNMuseArtifactPacket. We never emit a IXNMuseDataPacket with
        // IXNMuseDataPacketTypeArtifacts ; this is only here for use in
        // register / unregister methods.
        IXNMuseDataPacketType.artifacts,
        
        // Specifies raw EEG samples.
        // Values in this packet correspond to EEG data read from the
        // different sensor locations on the headband. The accessors in the
        // Eeg enum define the mapping from packet values to sensor
        // locations. The units of EEG values are microvolts.
        // The size of the data is unspecified, but it is large enough to
        // hold all the EEG channels emitted by the current preset. In the
        // current version of the library, it is never more than 6 elements
        // long, i.e. it always fits into a 6-element array.
        IXNMuseDataPacketType.eeg
    ]
    
    convenience override init() {
        self.init(museManager: IXNMuseManagerIos.sharedManager(), eventEmitter: EventEmitterImpl.sharedInstance)
    }
    
//    convenience init(withEventEmitter eventEmitter: RCTEventEmitter) {
//        self.init(museManager: IXNMuseManagerIos.sharedManager(), eventEmitter: eventEmitter)
//    }
    
    init(museManager: MuseManager, eventEmitter: EventEmitter)
    {
        self.museManager = museManager
        self.eventEmitter = eventEmitter
        super.init()
    }
    
    fileprivate func _getConnectedMuse() -> IXNMuse? {
        return MuseConnectionManagerImpl.sharedInstance.getConnectedMuse()
    }

    @objc(startClassifier:)
    func startClassifier(notchFrequency: NSNumber) {
    }
    @objc(stopClassifier)
    func stopClassifier() {
    }

    @objc(startNoiseListener)
    func startNoiseListener() {
        // @pre muse headset is already connected
        
        // Register listeners
        let muse: IXNMuse = self._getConnectedMuse()!
        self.dataListenersKeys.forEach { (packetType: IXNMuseDataPacketType) in
            muse.register(self, type: packetType)
        }
//        let awareSensorManager : AWARESensorManager = AWARECore.sharedSensorManager
        // @warning @todo UIApplication.delegate must be called from maoin thread only
        // let appDelegate = UIApplication.shared.delegate as! AppDelegate
        // let awareSensorManager = appDelegate.sharedAWARECore.sharedSensorManager
        // awareSensorManager!.startASensor("status_plugin_museeeg")
    }

    @objc(stopNoiseListener)
    func stopNoiseListener() {
        // @warning @todo UIApplication.delegate must be called from maoin thread only
        // let appDelegate = UIApplication.shared.delegate as! AppDelegate
        // let awareSensorManager = appDelegate.sharedAWARECore.sharedSensorManager
        // awareSensorManager!.stopASensor("plugin_museeeg")

        // Unregister listeners
        let muse: IXNMuse = self._getConnectedMuse()!
        self.dataListenersKeys.forEach { (packetType: IXNMuseDataPacketType) in
            muse.unregisterDataListener(self, type: packetType)
        }
    }
}

// MARK: - IXNMuseDataListener
extension ClassifierModule: IXNMuseDataListener {
    func receive(_ packet: IXNMuseDataPacket?, muse: IXNMuse?) {
        if let packet = packet {
            let timestamp = String(packet.timestamp() as Int64)
            let values = packet.values()
            switch packet.packetType() {
            case IXNMuseDataPacketType.battery:
                os_log("%@ packet! battery", timestamp)
                // os_log("packet! battery %@", packet
                //    .getBatteryValue(IXNBattery.chargePercentageRemaining))
                break

            case IXNMuseDataPacketType.isGood:
                os_log("%@ packet! isGood EEG1:%@ EEG2:%@ EEG3:%@ EEG4:%@", timestamp, values[IXNEeg.EEG1.rawValue],
                values[IXNEeg.EEG2.rawValue], values[IXNEeg.EEG3.rawValue],
                values[IXNEeg.EEG4.rawValue])

                eventEmitter.sendEvent(.isGoodEvent, body: [
                    "EEG1": values[IXNEeg.EEG1.rawValue],
                    "EEG2": values[IXNEeg.EEG2.rawValue],
                    "EEG3": values[IXNEeg.EEG3.rawValue],
                    "EEG4": values[IXNEeg.EEG4.rawValue]
                ])
                
                // Convert isGood event into a noise array containing the index
                // of the noisy electrodes
                var body: [String] = [];
                if (values[IXNEeg.EEG1.rawValue] == 0) {
                  body.append("0")
                }
                if (values[IXNEeg.EEG2.rawValue] == 0) {
                  body.append("1")
                }
                if (values[IXNEeg.EEG3.rawValue] == 0) {
                  body.append("2")
                }
                if (values[IXNEeg.EEG4.rawValue] == 0) {
                  body.append("3")
                }
                
                eventEmitter.sendEvent(.noise, body: body)

                break
                
            case IXNMuseDataPacketType.hsiPrecision:
                os_log("%@ packet! hsiPrecision EEG1:%@ EEG2:%@ EEG3:%@ EEG4:%@", timestamp, values[IXNEeg.EEG1.rawValue],
                values[IXNEeg.EEG2.rawValue], values[IXNEeg.EEG3.rawValue],
                values[IXNEeg.EEG4.rawValue])

                eventEmitter.sendEvent(.hsiPrecisionEvent, body: [
                    "EEG1": values[IXNEeg.EEG1.rawValue],
                    "EEG2": values[IXNEeg.EEG2.rawValue],
                    "EEG3": values[IXNEeg.EEG3.rawValue],
                    "EEG4": values[IXNEeg.EEG4.rawValue]
                ])

                break
                
            case IXNMuseDataPacketType.eeg:
  //                os_log("%@ packet! eeg EEG1:%@ EEG2:%@ EEG3:%@ EEG4:%@ AUXLEFT:%@ AUXRIGHT:%@", timestamp, values[IXNEeg.EEG1.rawValue],
  //                values[IXNEeg.EEG2.rawValue], values[IXNEeg.EEG3.rawValue],
  //                values[IXNEeg.EEG4.rawValue], values[IXNEeg.AUXLEFT.rawValue],
  //                values[IXNEeg.AUXRIGHT.rawValue])

                // @todo 
                break
                
            default:
                break
            }
        }
    }
    
    func receive(_ packet: IXNMuseArtifactPacket, muse: IXNMuse?) {
        os_log("packet! artifacts")
    }
}




//
//  MuseRecordService.swift
//  EEG101
//

import Foundation
// import Muse

public enum MuseRecordServiceError: Error {
    case museMacAddressNotFound(String)
}

/**
 * @description
 * Service for recording a connected muse headset.
 **/
open class MuseRecordService {
    private let museManager: IXNMuseManagerIos
    
    public init() {
        self.museManager = IXNMuseManagerIos.sharedManager()
    }
    
    public func startRecording(museMacAddress: String) throws -> MuseStream {
        // Retrieve the muse object from its mac address
        let muses: [IXNMuse] = museManager.getMuses()
        var muse: IXNMuse? = nil
        for currentMuse: IXNMuse in muses {
            let currentMuseMacAddress: String = currentMuse.getMacAddress()
            if museMacAddress == currentMuseMacAddress {
                muse = currentMuse
            }
        }
        
        // Throw exception if muse has not been found
        if muse == nil {
            throw MuseRecordServiceError.museMacAddressNotFound(museMacAddress)
        }
        
        // Create recording object
        guard let record = MuseStream(muse: muse!) else {
            // @todo rethrow insufficient memory instead
            throw MuseRecordServiceError.museMacAddressNotFound(museMacAddress)
        }
        
        // Start the recording
        record.start()
        
        // Return the recording object
        return record
    }
    
    public func stopRecording(_ record: MuseStream) {
        record.stop()
    }
    
    public func convert<T>(packet: IXNMuseDataPacket, to outputType: T.Type) -> T {
        if outputType == [String: Any].self {
            let data: [String: Any] = [
                // Int64
                "TIMESTAMP": packet.timestamp(),
                // Double (= Float64)
                "EEG1": packet.getEegChannelValue(IXNEeg.EEG1),
                "EEG2": packet.getEegChannelValue(IXNEeg.EEG2),
                "EEG3": packet.getEegChannelValue(IXNEeg.EEG3),
                "EEG4": packet.getEegChannelValue(IXNEeg.EEG4),
                "AUXLEFT": packet.getEegChannelValue(IXNEeg.AUXLEFT),
                "AUXRIGHT": packet.getEegChannelValue(IXNEeg.AUXRIGHT)
            ]
            return data as! T
        }
        else {
            assertionFailure("Unsupported conversion for packet")
        }
        
        fatalError("Unsupported conversion for packet")
    }
}

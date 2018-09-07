//
//  MuseStream.swift
//  EEG101
//

import Foundation
import RingBuffer
// import Muse

/**
 * @description
 * Record muse data in a buffer.
 *
 * @warning
 * Not thread safe!
 **/
open class MuseStreamIsGood: IXNMuseDataListener {
  private let muse: IXNMuse
    
  // C TPRingBuffer wrapper. Must contain memory contingeous values such as MemoryLayout<T>.size is meaningful.
  private var isGoodBuffer: RingBuffer<UInt64>

//    private let bufferSize: Int = 1024 * 4 * MemoryLayout<Int>.size // 4 * 64b chanels @todo use struct instead
  private var isRecording: Bool = false
    
  public init?(muse: IXNMuse) {
    self.muse = muse
    self.isRecording = false
    
    let frequency = 200000 // 20khz muse sampling rate
    let duration = 5  // 5s buffer size
    let bufferCount = frequency * duration
    // self.buffer = RingBuffer<NSDictionary>(count: bufferCount)
    
    guard let isGoodBuffer = RingBuffer<UInt64>(capacity: bufferCount * 5) else {
      // @todo throw insufficient memory exception
      print("not enough memory")
      return nil
    }
    self.isGoodBuffer = isGoodBuffer
  }
  
  func start() {
    // @todo @warning unreliable - muse can disconnect for timeout or low-battery
    assert(muse.getConnectionState() == IXNConnectionState.connected) // @todo throw instead
    
    self.isRecording = true
    muse.register(self, type: IXNMuseDataPacketType.isGood)
  }
  
  func stop() {
    muse.unregisterDataListener(self, type: IXNMuseDataPacketType.isGood)
    
    self.isRecording = false
  }
  
  /* input */
  public func receive(_ packet: IXNMuseDataPacket?, muse: IXNMuse?) {
    // `#receive` are called from an external thread, but buffer is thread
    // safe.
    
    assert(packet != nil, "Unsupported Muse nil EEG packet")
    
    switch(packet!.packetType()) {

    case IXNMuseDataPacketType.isGood:
      // prevent multiple producers (== one across multiple thread) ?
      // objc_sync_enter(self.buffer)
      
      // prevent drop in frequency
      // @todo @warning remove after tests or do stg else ?
      guard self.isGoodBuffer.availableCapacity >= 5 else {
        assertionFailure("Not enough available capacity in ring buffer, consumer slower than producer")
        return
      }
      
      let val = packet!.values()
      
      // @note can be optimized as #feed checks available buffer capacity 5 times
      self.isGoodBuffer.feed(UInt64.init(bitPattern: packet!.timestamp()))
      self.isGoodBuffer.feed(val[IXNEeg.EEG1.rawValue].doubleValue.bitPattern)
      self.isGoodBuffer.feed(val[IXNEeg.EEG2.rawValue].doubleValue.bitPattern)
      self.isGoodBuffer.feed(val[IXNEeg.EEG3.rawValue].doubleValue.bitPattern)
      self.isGoodBuffer.feed(val[IXNEeg.EEG4.rawValue].doubleValue.bitPattern)
      // objc_sync_exit(self.buffer)
      break

    default:
      print("????")
    }
  }
  
  public func receive(_ packet: IXNMuseArtifactPacket, muse: IXNMuse?) {
      // we do nothing concerning artifacts
  }

  public func isEmpty() -> Bool {
    return self.isGoodBuffer.count == 0
  }
  public func consume() -> IXNMuseDataPacket? {
    guard self.isGoodBuffer.count >= 5 else {
      return nil
    }

    let tail = self.isGoodBuffer.tail!

    let timestamp: Int64 = Int64(bitPattern: tail[0])
    var values: [NSNumber] = []
    values.insert(NSNumber.init(value: Float64(bitPattern: tail[1])), at: IXNEeg.EEG1.rawValue)
    values.insert(NSNumber.init(value: Float64(bitPattern: tail[2])), at: IXNEeg.EEG2.rawValue)
    values.insert(NSNumber.init(value: Float64(bitPattern: tail[3])), at: IXNEeg.EEG3.rawValue)
    values.insert(NSNumber.init(value: Float64(bitPattern: tail[4])), at: IXNEeg.EEG4.rawValue)

    self.isGoodBuffer.free(5)

    return IXNMuseDataPacket.make(IXNMuseDataPacketType.isGood, timestamp: timestamp, values: values)
  }

}



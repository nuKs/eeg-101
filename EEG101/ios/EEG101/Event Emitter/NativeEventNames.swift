
enum NativeEvent: String {
    case noise = "NOISE"
    case museListChanged = "MUSE_LIST_CHANGED"
    case connectionChanged = "CONNECTION_CHANGED"
    case predictResultEvent = "PREDICT_RESULT"
    case isGoodEvent = "IS_GOOD"
    case hsiPrecisionEvent = "HSI_PRECISION"
    
    static let allValues: [NativeEvent] = [
        .noise,
        .museListChanged,
        .connectionChanged,
        .predictResultEvent,
        .isGoodEvent,
        .hsiPrecisionEvent
    ]
}

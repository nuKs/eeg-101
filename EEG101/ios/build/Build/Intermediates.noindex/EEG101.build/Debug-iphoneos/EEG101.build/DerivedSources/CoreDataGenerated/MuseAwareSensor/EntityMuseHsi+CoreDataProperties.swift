//
//  EntityMuseHsi+CoreDataProperties.swift
//  
//
//  Created by medullosuprarenal on 18/10/2018.
//
//  This file was automatically generated and should not be edited.
//

import Foundation
import CoreData


extension EntityMuseHsi {

    @nonobjc public class func fetchRequest() -> NSFetchRequest<EntityMuseHsi> {
        return NSFetchRequest<EntityMuseHsi>(entityName: "EntityMuseHsi")
    }

    @NSManaged public var device_id: String?
    @NSManaged public var double_eeg_1: NSNumber?
    @NSManaged public var double_eeg_2: Double
    @NSManaged public var double_eeg_3: Double
    @NSManaged public var double_eeg_4: Double
    @NSManaged public var timestamp: Double

}

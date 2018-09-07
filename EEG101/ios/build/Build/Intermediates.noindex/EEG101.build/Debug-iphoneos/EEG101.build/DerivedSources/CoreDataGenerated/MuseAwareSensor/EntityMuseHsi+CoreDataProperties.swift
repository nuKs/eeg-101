//
//  EntityMuseHsi+CoreDataProperties.swift
//  
//
//  Created by medullosuprarenal on 29/08/2018.
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
    @NSManaged public var eeg_1: NSNumber?
    @NSManaged public var eeg_2: Double
    @NSManaged public var eeg_3: Double
    @NSManaged public var eeg_4: Double
    @NSManaged public var timestamp: NSNumber?

}

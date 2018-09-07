//
//  EntityMuseEeg+CoreDataProperties.swift
//  
//
//  Created by medullosuprarenal on 29/08/2018.
//
//  This file was automatically generated and should not be edited.
//

import Foundation
import CoreData


extension EntityMuseEeg {

    @nonobjc public class func fetchRequest() -> NSFetchRequest<EntityMuseEeg> {
        return NSFetchRequest<EntityMuseEeg>(entityName: "EntityMuseEeg")
    }

    @NSManaged public var device_id: String?
    @NSManaged public var eeg_1: NSNumber?
    @NSManaged public var eeg_2: Double
    @NSManaged public var eeg_3: Double
    @NSManaged public var eeg_4: Double
    @NSManaged public var timestamp: NSNumber?

}

//
//  EntityMuseEeg+CoreDataProperties.swift
//  
//
//  Created by medullosuprarenal on 18/10/2018.
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
    @NSManaged public var double_eeg_1: NSNumber?
    @NSManaged public var double_eeg_2: Double
    @NSManaged public var double_eeg_3: Double
    @NSManaged public var double_eeg_4: Double
    @NSManaged public var timestamp: NSNumber?

}

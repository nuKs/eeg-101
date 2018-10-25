//
//  EntityMuseAccelerometer+CoreDataProperties.swift
//  
//
//  Created by medullosuprarenal on 18/10/2018.
//
//  This file was automatically generated and should not be edited.
//

import Foundation
import CoreData


extension EntityMuseAccelerometer {

    @nonobjc public class func fetchRequest() -> NSFetchRequest<EntityMuseAccelerometer> {
        return NSFetchRequest<EntityMuseAccelerometer>(entityName: "EntityMuseAccelerometer")
    }

    @NSManaged public var device_id: String?
    @NSManaged public var double_x: NSNumber?
    @NSManaged public var double_y: Double
    @NSManaged public var double_z: Double
    @NSManaged public var timestamp: NSNumber?

}

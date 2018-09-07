//
//  EntityMuseAccelerometer+CoreDataProperties.swift
//  
//
//  Created by medullosuprarenal on 29/08/2018.
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
    @NSManaged public var timestamp: NSNumber?
    @NSManaged public var x: NSNumber?
    @NSManaged public var y: Double
    @NSManaged public var z: Double

}

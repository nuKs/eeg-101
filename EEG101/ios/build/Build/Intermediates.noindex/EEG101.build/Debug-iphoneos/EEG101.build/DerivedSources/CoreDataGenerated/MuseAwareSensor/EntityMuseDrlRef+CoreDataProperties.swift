//
//  EntityMuseDrlRef+CoreDataProperties.swift
//  
//
//  Created by medullosuprarenal on 29/08/2018.
//
//  This file was automatically generated and should not be edited.
//

import Foundation
import CoreData


extension EntityMuseDrlRef {

    @nonobjc public class func fetchRequest() -> NSFetchRequest<EntityMuseDrlRef> {
        return NSFetchRequest<EntityMuseDrlRef>(entityName: "EntityMuseDrlRef")
    }

    @NSManaged public var device_id: String?
    @NSManaged public var drl: Double
    @NSManaged public var ref: NSNumber?
    @NSManaged public var timestamp: NSNumber?

}

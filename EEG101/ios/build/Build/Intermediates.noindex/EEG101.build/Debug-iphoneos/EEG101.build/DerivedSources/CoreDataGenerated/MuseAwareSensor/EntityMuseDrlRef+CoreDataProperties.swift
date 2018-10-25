//
//  EntityMuseDrlRef+CoreDataProperties.swift
//  
//
//  Created by medullosuprarenal on 18/10/2018.
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
    @NSManaged public var double_drl: Double
    @NSManaged public var double_ref: NSNumber?
    @NSManaged public var timestamp: NSNumber?

}

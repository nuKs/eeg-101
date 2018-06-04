/**
 * A button of the app's main menu.
 **/

import React, { Component } from 'react';
import styled from "styled-components";
import {
  Link,
  withRouter
} from "react-router-native";
import { Button, Icon, Text, Badge } from 'native-base';

const FooterMenuButton = withRouter(({route, icon, children, location, badge}) => 
    // Only props.route & props.icon has to be set by user, other props are set 
    // via #withRooter
    <Link
        component={Button}
        to={route}
        vertical
        active={location.pathname === route || location.pathname.startsWith(route+'/')} 
        {...(typeof badge !=='undefined' ? {badge: true} : {})}
    >
        {(typeof badge !== 'undefined') && 
            <Badge><Text>{badge}</Text></Badge>
        }
        <Icon name={icon} />
        <Text>{children}</Text>
    </Link>
);

export default FooterMenuButton;
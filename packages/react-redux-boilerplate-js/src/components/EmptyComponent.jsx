import React from 'react'

export default function (componentDisplayName){
  class EmptyComponent extends React.Component {
    static displayName = componentDisplayName;

    constructor(props){
      super(props);
    } 

    render(){
      return null;
    }

  }
  return EmptyComponent;
}




import React from 'react'
import path from '../path'
import { Link } from 'react-router'

function NLink(props){
  var other_props = { }; 
  if(props.to){
    other_props.to = path(props.to);
  }
  return (
    <Link 
      { ...props }
      { ...other_props }
    >
      { props.children }
    </Link>
  )
};

export default NLink;




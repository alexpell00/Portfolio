import React from 'react';
import ReactDOM from 'react-dom';
import Timer from './components/Timer'
import Description from './components/Description'
import FilterableProjects from './components/FilterableProjects'
import ContactUs from './components/ContactUs'

ReactDOM.render(<FilterableProjects />, document.getElementById('project-items'));
ReactDOM.render(<ContactUs />, document.getElementById('contact-us'));

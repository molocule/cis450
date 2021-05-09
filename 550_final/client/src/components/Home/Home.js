import React from 'react';
import '../../style/Home.css'
import { Link } from 'react-router-dom';

function Home({

}) {
  return (
   <>
    <div class="jumbotron text-center">
        <h1>ListenUp</h1>
        <p>Resize this responsive page to see the effect!</p>
        </div>

        <div class="container">
        <div class="row">
            <div class="col-sm-4">
            <h3>Column 1</h3>
            <p>Lorem ipsum dolor..</p>
            </div>
            <div class="col-sm-4">
            <h3>Column 2</h3>
            <p>Lorem ipsum dolor..</p>
            </div>
            <div class="col-sm-4">
            <h3>Column 3</h3>
            <p>Lorem ipsum dolor..</p>
            </div>
        </div>
    </div>
   </>
  );
}

export default Home;
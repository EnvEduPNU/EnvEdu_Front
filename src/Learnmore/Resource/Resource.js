import './Resource.css';
import water from './Image/water.png';
import water2 from './Image/water2.png';
import ground from './Image/ground.png';
import ground2 from './Image/ground2.png';
import air from './Image/air.png';
import air2 from './Image/air2.png';
import dong11 from './Image/dong11.png';
import dong22 from './Image/dong22.png';

function Resource(){
    return(
        <>
         <div className="container-fluid" id="con1">
           <h1>Education Resources</h1>
        </div>
        <div className="container">
        <div className="container">
<div className="d-flex flex-row-reverse">
<div class="d-lg-flex">
<button type="button" class="btn btn-secondary" id="S_botton">Search</button>
</div>
<div class="d-lg-flex">
    <label  class="visually-hidden" for="specificSizeInputName">Name</label>
    <input type="text" class="form-control" id="specificSizeInputName" placeholder="Search"/>
</div>
</div>
</div>


<div className="album py-5 bg-light">
  <div className="container">

    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
      <div className="col">
        <div className="card shadow-sm">
        
      <img src={water2} width="195em"/>
          <div className="card-body">
            <p className="card-text">수권에 대한 이해</p>
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">2022.12.15</small>
            </div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card shadow-sm">
        <img src={ground2} width="195em"/> 
          <div className="card-body">
            <p className="card-text">지권에 대한 이해</p>
            <div className="d-flex justify-content-between align-items-center">
  
              <small className="text-muted">2022.12.15</small>
            </div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card shadow-sm">
        <img src={air2} width="195em"/> 
          <div className="card-body">
            <p className="card-text">기권에 대한 이해</p>
            <div className="d-flex justify-content-between align-items-center">
  
              <small className="text-muted">2022.12.15</small>
            </div>
          </div>
        </div>
      </div>

      <div className="col">
        <div className="card shadow-sm">
        <img src={dong11} width="195em"/> 
          <div className="card-body">
            <p className="card-text">환경동아리 생태계 보전</p>
             <div className="d-flex justify-content-between align-items-center">
  
              <small className="text-muted">2022.12.15</small>
            </div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card shadow-sm">
        <img src={dong22} width="195em"/> 
          <div className="card-body">
          <p className="card-text">백로 서식지 파괴를 통해 알아보는 자연환경문제에 관한 토론</p>
           <div className="d-flex justify-content-between align-items-center">
  
              <small className="text-muted">2022.12.15</small>
            </div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card shadow-sm">
        <svg className="bd-placeholder-img card-img-top" width="100%" height="14.5em" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: " preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em"></text></svg>

          <div className="card-body">
            <p className="card-text"><br/><br/><br/></p>
            <div className="d-flex justify-content-between align-items-center">
  
              <small className="text-muted">올린 날짜</small>
            </div>
          </div>
        </div>
      </div>

      <div className="col">
        <div className="card shadow-sm">
          <svg className="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: " preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em"></text></svg>

          <div className="card-body">
            <p className="card-text"></p>
            <div className="d-flex justify-content-between align-items-center">
  
              <small className="text-muted">올린 날짜</small>
            </div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card shadow-sm">
          <svg className="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: " preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em"></text></svg>

          <div className="card-body">
            <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            <div className="d-flex justify-content-between align-items-center">
  
              <small className="text-muted">올린 날짜</small>
            </div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card shadow-sm">
          <svg className="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: " preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em"></text></svg>

          <div className="card-body">
            <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            <div className="d-flex justify-content-between align-items-center">
  
              <small className="text-muted">올린 날짜</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<nav aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item"><a class="page-link" href="#">4</a></li>
    <li class="page-item"><a class="page-link" href="#">5</a></li>
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  </ul>
</nav>

        </div>

        </>
    );
}export default Resource;
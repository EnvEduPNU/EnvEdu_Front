import './ContactUs.css';
import Image1 from './Image/image1.jpg'
function ContactUs() {
  return (
    <>

      <div className="container-fluid" id="con1">
        <h1>Contact Us</h1>
      </div>


      <div className="container">
        <div className="row featurette" style={{ padding: '2em' }}>
          <div className="col-md-7 order-md-2">
            <a href='https://seie.pusan.ac.kr/earthedulab/index..do'>
              <h3 className="featurette-heading fw-normal lh-1">
                <br />
                과학공학 융합교육 연구실 <span className="text-muted"></span>
              </h3></a>
          </div>
          <div className="col-md-5 order-md-1">


            <a href='https://seie.pusan.ac.kr/earthedulab/index..do'>
              <img src={Image1} width="100%" /></a>


          </div>
        </div>



      </div>


    </>
  );
}
export default ContactUs;












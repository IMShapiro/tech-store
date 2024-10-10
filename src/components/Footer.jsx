const Footer = () => {
  return (
    <footer className="container-fluid bg-dark text-white footer">
      <div className="row footer-content">
        <div className="col footer-section about">
          <h3>About Us</h3>
          <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, commodi non. Praesentium fugit expedita labore doloribus vel porro ipsum deleniti reiciendis earum aperiam voluptatum fuga magnam quis nostrum sapiente quibusdam inventore aliquam quas aspernatur dolores non, necessitatibus quia molestiae nihil.
          </p>
        </div>

        <div className="col footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>

        <div className="col footer-section social">
          <h3>Follow Us</h3>
          <ul>
            <li><a href="https://www.facebook.com">Facebook</a></li>
            <li><a href="https://www.instagram.com">Instagram</a></li>
            <li><a href="https://wa.link/">Whatsapp</a></li>
          </ul>
        </div>
      </div>

      <div className="row">
        <p className="text-center">Icons by <a href="https://icons8.com" target="_blank">Icons8</a></p>
      </div>

      <div className="row footer-bottom">
        <p className="text-center">&copy; {new Date().getFullYear()} Tech Store. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
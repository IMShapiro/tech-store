function Contact(){
    return (
        <div className="container contact p-2">
        <h1 className="my-4">Contact Us</h1>
        <p>
            Whether you can't find the products you're looking for or need more information about our services, we're here to assist you. Please fill out the form below, and our team will get in touch with you soon.
        </p>
        <form>
            <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" id="name" required />
            </div>
            <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" className="form-control" id="email" required />
            </div>
            <div className="mb-3">
            <label htmlFor="message" className="form-label">Message</label>
            <textarea className="form-control" id="message" rows="5" required></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
        </div>
    );
};
  
export default Contact;
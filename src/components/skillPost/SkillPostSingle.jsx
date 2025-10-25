function SkillPostSingle( {skillPost, author } ) {
  return (
      <div>
            <div className="single-post">
                    <div className="feature-img">
                      <img className="img-fluid" src={skillPost.img} alt="" />
                    </div>
                    <div className="blog_details">
                      <h2> {skillPost.title}
                      </h2>
                      <ul className="blog-info-link mt-3 mb-4">
                        <li><a href="#"><i className="fa fa-user" /> {author?.fullName || "Unknown Author"}</a></li>
                        <li><a href="#"><i className="fa fa-comments" /> {skillPost.commentCount}</a></li>
                      </ul>
                      <p className="excert">
                        {skillPost.pargrhap_1}
                      </p>
                      <p>
                        {skillPost.pargrhap_2}
                      </p>
                      <div className="quote-wrapper">
                        <div className="quotes">
                          {skillPost.pargrhap_3}
                        </div>
                      </div>
                      <p>
                        {skillPost.pargrhap_4}
                      </p>
                      <p>
                        {skillPost.pargrhap_5}
                      </p>
                    </div>
                  </div>
                  <div className="navigation-top">
                    <div className="d-sm-flex justify-content-between text-center">
                      <p className="like-info"><span className="align-middle"><i className="fa fa-heart" /></span> Lily and 4
                        people like this</p>
                      <div className="col-sm-4 text-center my-2 my-sm-0">
                        {/* <p class="comment-count"><span class="align-middle"><i class="fa fa-comment"></i></span> 06 Comments</p> */}
                      </div>
                      <ul className="social-icons">
                        <li><a href="#"><i className="fab fa-facebook-f" /></a></li>
                        <li><a href="#"><i className="fab fa-twitter" /></a></li>
                        <li><a href="#"><i className="fab fa-dribbble" /></a></li>
                        <li><a href="#"><i className="fab fa-behance" /></a></li>
                      </ul>
                    </div>
               
                  </div>
                 <div className="blog-author">
        <div className="media align-items-center">
          {author?.profileImage && (
            <img
              src={author.profileImage}
              alt={author?.fullName || "Unknown Author"}
              style={{ width: "70px", height: "70px", borderRadius: "50%" }}
            />
          )}
          <div className="media-body">
            <a href="#">
              <h4>{author?.fullName || "Unknown Author"}</h4>
            </a>
            <p>{skillPost.summary}</p>
          </div>
        </div>
      </div>
        </div>
  )
}

export default SkillPostSingle
import React from 'react'

function SingleUser( { user  }) {
  return (
   
            <div>
            <div className="col-xl-12 col-lg-6 col-md-6 col-sm-10">
                <div className="whats-right-single mb-20">
                    <div className="whats-right-img">
                        <img src={user.img} alt={user.name} style={{ width: '124px', height: '104px', objectFit: 'cover' }} />
                    </div>
                    <div className="whats-right-cap">
                        <span className="colorb" style={{ fontSize: '12px' }}>{user.category}</span>

                        <h6><a href="latest_news.html">{user.name}</a></h6>
                        <p>{user.date}</p>
                    </div>
                </div>
            </div>
        </div>
  
  )
}

export default SingleUser
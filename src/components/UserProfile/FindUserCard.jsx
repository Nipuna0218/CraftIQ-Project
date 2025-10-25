import React from 'react';

function FindUserCard({ user, onFollow }) {
  return (
    <div>
      <div className="section-top-border">
        <div className="row">
          <div className="col-md-12 d-flex flex-column align-items-center text-center">
            <div className="single-defination">
              <div className="image-wrapper">
                <img
                  src={user.img}
                  alt={user.name}
                  className="user-image"
                />
                <div className="overlay">
                  <button
                    className="follow-btn"
                    onClick={() => onFollow(user.id)}
                  >
                    {user.isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>
              <h3 className="mt-3">{user.name}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FindUserCard;

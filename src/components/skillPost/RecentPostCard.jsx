import { Link } from 'react-router-dom';

function RecentPostCard({ skillpost }) {
  return (
    <div>
      <div className="media post_item mb-10">
        <img
          src={`data:image/jpeg;base64,${skillpost.imageBase64}`}
          alt="post"
          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
        />
        <div className="media-body">
          <Link className="d-inline-block" to={`/user/skill-post-details/${skillpost.id}`}>
            <h3>{skillpost.title}</h3>
          </Link>
          {skillpost.createdAt && (
            <p>{new Date(skillpost.createdAt).toLocaleDateString()}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecentPostCard;

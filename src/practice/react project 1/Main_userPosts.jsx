

const Main_userPosts = ({post}) => {

    return (
        <>
        
        <div className="todo">

        <strong>Post ID:</strong> {post.id} <strong>Title:</strong> {post.title} <br />
        <strong>Body:</strong> {post.body}

        </div>
        </>
    )
}
export default Main_userPosts;
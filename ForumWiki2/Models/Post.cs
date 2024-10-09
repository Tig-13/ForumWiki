using System;

public class Post
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Content { get; set; }
    public int CategoryId { get; set; }
    public int UserId { get; set; }
    public int Likes { get; set; } = 0;  
    public DateTime CreatedAt { get; set; } = DateTime.Now;  
}

@version 1

# Initialize hall condition
condition triggered_by: transaction, on: init(creation_address, name, description, category, is_private), as: [
  content: (
    # Can only be initialized by master contract
    previous_address = Chain.get_previous_address(transaction)
    genesis_address = Chain.get_genesis_address(previous_address)
    hall = State.get("hall")
    valid? = hall == nil && genesis_address == get_master_address()

    valid?

  )
]

# Initialize hall action
actions triggered_by: transaction, on: init(creation_address, name, description, category, is_private) do
  genesis_address = Chain.get_genesis_address(creation_address)
  creation_transaction = Chain.get_transaction(creation_address)
  # Create initial member (creator) with admin role
  creator_genesis_address = get_creator_address()
  initial_member = [
    address: creator_genesis_address,
    role: "admin",
    reputation: 100
  ]

  members = Map.set(Map.new(),creator_genesis_address, initial_member)
  
  # Initialize hall state
  hall = [
    id: String.to_hex(creation_address),
    admin_address: creator_genesis_address,
    name: name,
    description: description,
    category: category,
    members: members,
    metrics: [
      total_posts: 0,
      active_members: 1,
      energy_pool: 100,
      unread_count: 0
    ],
    settings: [
      is_private: is_private,
      requires_approval: false,
    ],
    zones: [fast: [posts: Map.new(),],
      cruise: [posts: Map.new(),],
      archive: [posts: Map.new(),]
    ],
    created_at: creation_transaction.timestamp
  ]
  State.set("hall", hall)
end

# Join hall condition
condition triggered_by: transaction, on: join(), as: [
  content: (
    hall = State.get("hall")
    previous_address = Chain.get_previous_address(transaction)
    member_genesis_address = Chain.get_genesis_address(previous_address)
    
    # Verify hall exists and member not already joined
    valid? = hall != nil 

    if valid? do 

      members = Map.get(hall,"members", Map.new())
      valid? = Map.get(members,member_genesis_address) == nil


    end
    
    # Check hall settings
    if valid? && hall.settings.requires_approval do
      valid? = has_admin_approval?(member_genesis)
    end
    
   
    valid?
  )
]

# Join hall action
actions triggered_by: transaction, on: join() do
  hall = State.get("hall")
  previous_address = Chain.get_previous_address(transaction)
  member_genesis_address = Chain.get_genesis_address(previous_address)

  members = Map.get(hall,"members")
  
  new_member = [
    address: member_genesis_address,
    role: "member",
    reputation: 0
  ]

  members = Map.set(members,member_genesis_address, new_member)
  
  # Update members list
  hall = Map.set(hall, "members", members)
  
  # Update metrics
  metrics = Map.get(hall, "metrics")
  metrics = Map.set(metrics, "active_members", metrics.active_members + 1)
  hall = Map.set(hall, "metrics", metrics)
  
  State.set("hall", hall)
end

# Create post condition
condition triggered_by: transaction, on: create_post(content, type, tags), as: [
  content: (
    hall = State.get("hall")
    previous_address = Chain.get_previous_address(transaction)
    member_genesis_address = Chain.get_genesis_address(previous_address)
    
    # Verify hall has been init and sender is a member
    members = Map.get(hall,"members")
    hall != nil && Map.get(members,member_genesis_address) != nil
  )
]

# Create post action
actions triggered_by: transaction, on: create_post(content, type, tags) do
  hall = State.get("hall")
  previous_address = Chain.get_previous_address(transaction)
  member_genesis_address = Chain.get_genesis_address(previous_address)
  member = get_member(member_genesis_address)

  metrics = Map.get(hall, "metrics")

  post_id = metrics.total_posts + 1
  
  post = [
    id: metrics.total_posts + 1,
    content: content,
    author: [
      address: member_genesis_address,
      name: "Anonymous",
      reputation: 0
    ],
    timestamp: transaction.timestamp,
    engagement: [
      likes: 0,
    ],
    metadata: [
      type: type,
      tags: tags
    ],
    metrics: [
      engagement_velocity: 0,
      quality_score: 0.5
    ]
  ]
  
  # Add post to hall's fast zone posts
  zones = Map.get(hall,"zones")
  zone = Map.get(zones, "fast")
  posts = Map.get(zone,"posts",Map.new())

  posts = Map.set(posts,post_id, post)

  zone = Map.set(zone,"posts",posts)

  zones = Map.set(zones,"fast", zone)
   
  hall = Map.set(hall, "zones", zones)
  
  # Update metrics
  metrics = Map.set(metrics, "total_posts", total_posts + 1 )
  hall = Map.set(hall, "metrics", metrics)
  
  State.set("hall", hall)
end

# Helper functions
fun member_exists?(genesis_address) do
  hall = State.get("hall")
  members = Map.get(hall, members)
  Map.get(members, genesis_address ) != nil
end

fun get_member(genesis_address) do
  hall = State.get("hall")
  members = Map.get(hal,"members")
  member = Map.get(members,genesis_address)
end

fun has_admin_approval?(genesis_address) do
  # TODO: Implement admin approval check
  true
end

fun get_member_reputation(genesis_address) do
  # TODO: Implement reputation check from master contract
  0
end

fun get_member_name(genesis_address) do
  # TODO: Implement getting member name from profile
  "Anonymous"
end

# Export functions
export fun get_hall() do
  State.get("hall")
end

export fun get_posts_by_zone(zone) do
  hall = State.get("hall")
  zones = Map.get(hall,"zones")
  zone = Map.get(zones,zone)
  posts = Map.get(zone, "posts", Map.new())
end

export fun get_creator_address() do
  "0x${placeholders.CREATOR_ADDRESS}"
end


export fun get_master_address() do
  "0x${placeholders.MASTER_ADDRESS}"
end
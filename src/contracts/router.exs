@version 1

# Create hall condition
condition triggered_by: transaction, on: add_hall(hall_creation_address, name, description, category, is_private), as: [
  content: (

    previous_address = Chain.get_previous_address(transaction)
    creator_genesis_address = Chain.get_genesis_address(previous_address)

    valid_creator? = Contract.call_function(hall_creation_address, "get_creator", []) == creator_genesis_address

    hall_creation_address = String.to_hex(hall_creation_address)
    hall_transaction = Chain.get_transaction(hall_creation_address)
    valid_hall? = hall_transaction != nil
   
    valid_code? = false
    valid_code? = Code.is_same?(get_hall_code(creator_genesis_address), hall_transaction.code)

    valid_params? = name != nil && description != nil && category != nil

   valid_hall? &&
   valid_creator? &&
   valid_code? && 
   valid_params?
  )
]

# Create hall action
actions triggered_by: transaction, on: add_hall(hall_creation_address,name, description, category, is_private) do

  hall_creation_address = String.to_hex(hall_creation_address)
  hall_transaction = Chain.get_transaction(hall_creation_address)

  previous_address = Chain.get_previous_address(transaction)
  creator_genesis_address = Chain.get_genesis_address(previous_address)
  
  # Create hall structure
  hall = [
    id: hall_creation_address,
    name: name,
    description: description,
    category: category,
    creator: creator_genesis_address,
    settings: [
      is_private: is_private,
      minimum_reputation: minimum_reputation
    ],
    created_at: transaction.timestamp
  ]
  
  # Store hall in master contract state
  halls = State.get("halls", Map.new())
  halls = Map.set(halls, hall.id, hall)
  State.set("halls", halls)
  
  # init hall contract
  Contract.set_type("transfer")
  Contract.add_recipient(
    address: hall_creation_address,
    action: "init",
    args: [hall_creation_address, name, description, category, is_private]
  )
end

# Join hall condition
condition triggered_by: transaction, on: join_hall(hall_id), as: [
  content: (
    halls = State.get("halls", Map.new())
    hall = Map.get(halls, String.to_hex(hall_id))
    hall != nil
  )
]

# Join hall action
actions triggered_by: transaction, on: join_hall(hall_id) do
  Contract.set_type("transfer")
  Contract.add_recipient(
    address: hall_id,
    action: "join",
    args: []
  )
end

# Get posts by zone condition
condition triggered_by: transaction, on: get_posts_by_zone(hall_id, zone), as: [
  content: (
    halls = State.get("halls", Map.new())
    hall = Map.get(halls, String.to_hex(hall_id))
    hall != nil && List.in?(["fast", "cruise", "archive"], zone)
  )
]

# Get posts by zone action
actions triggered_by: transaction, on: get_posts_by_zone(hall_id, zone) do
  Contract.call_function(hall_id, "get_posts_by_zone", [zone])
end

# Helper functions
fun get_hall_code(creator_genesis_genesis) do
  """
  @version 1
  # Hall contract code here...
  """
end

# Export functions
export fun get_halls() do
  State.get("halls", Map.new())
end

export fun get_hall(hall_id) do
  halls = State.get("halls", Map.new())
  Map.get(halls, String.to_hex(hall_id))
end

export fun get_featured_halls() do
  halls = State.get("halls", Map.new())
  featured_halls = State.get("featured_halls", [])
  

end

export fun get_recent_activity(hall_id) do


    
end

export fun get_achievements() do
 
end 
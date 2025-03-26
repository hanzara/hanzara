# Create an empty list called my_list
my_list = []
print(f"Initial list: {my_list}")

# Append the following elements to my_list: 10, 20, 30, 40
my_list.append(10)
my_list.append(20)
my_list.append(30)
my_list.append(40)
print(f"List after appending: {my_list}")

# Insert the value 15 at the second position in the list
my_list.insert(1, 15)  # Index 1 represents the second position
print(f"List after inserting 15 at the second position: {my_list}")

# Extend my_list with another list: [50, 60, 70]
another_list = [50, 60, 70]
my_list.extend(another_list)
print(f"List after extending with [50, 60, 70]: {my_list}")

# Remove the last element from my_list
my_list.pop()
print(f"List after removing the last element: {my_list}")

# Sort my_list in ascending order
my_list.sort()
print(f"List after sorting in ascending order: {my_list}")

# Find and print the index of the value 30 in my_list
index_of_30 = my_list.index(30)
print(f"The index of the value 30 in my_list is: {index_of_30}")
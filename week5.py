def modify_and_write_file(input_filename, output_filename):
    """
    Reads an input file, modifies each line, and writes the modified
    content to a new output file.

    Args:
        input_filename (str): The name of the file to read.
        output_filename (str): The name of the file to write to.
    """
    try:
        with open(input_filename, 'r') as infile:
            try:
                with open(output_filename, 'w') as outfile:
                    for line in infile:
                        # Modify the line (example: add a prefix)
                        modified_line = f"[MODIFIED] {line.strip()}\n"
                        outfile.write(modified_line)
                print(f"Successfully read '{input_filename}', modified it, and wrote to '{output_filename}'.")
            except IOError:
                print(f"Error: Could not write to the file '{output_filename}'.")
    except FileNotFoundError:
        print(f"Error: The input file '{input_filename}' was not found.")
    except IOError:
        print(f"Error: Could not read the file '{input_filename}'.")

if __name__ == "__main__":
    input_file = input("Enter the name of the input file: ")
    output_file = input("Enter the name of the output file: ")
    modify_and_write_file(input_file, output_file)

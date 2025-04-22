import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.datasets import load_iris  # Example dataset

# --- Task 1: Load and Explore the Dataset ---
def load_and_explore_data(dataset_choice="iris", file_path=""):
    """
    Loads and explores a dataset.

    Args:
        dataset_choice (str, optional): "iris" or "csv". Defaults to "iris".
        file_path (str, optional): Path to CSV file if dataset_choice is "csv".
                                 Defaults to "".

    Returns:
        pd.DataFrame: Loaded and cleaned DataFrame.
    """

    try:
        if dataset_choice == "iris":
            iris_data = load_iris(as_frame=True)
            data = iris_data.frame
        elif dataset_choice == "csv":
            if not file_path:
                raise ValueError("File path must be provided for CSV dataset.")
            data = pd.read_csv(file_path)
        else:
            raise ValueError("Invalid dataset choice. Choose 'iris' or 'csv'.")

        print("\n--- 1.1 First 5 rows ---")
        print(data.head())

        print("\n--- 1.2 Data Information ---")
        print(data.info())

        print("\n--- 1.3 Summary Statistics ---")
        print(data.describe())

        print("\n--- 1.4 Missing Values (Before Cleaning) ---")
        print(data.isnull().sum())

        # Clean the data (Handling missing values)
        data_cleaned = data.dropna()  # Or data.fillna(some_value)
        print("\n--- 1.5 Missing Values (After Cleaning) ---")
        print(data_cleaned.isnull().sum())

        return data_cleaned

    except FileNotFoundError:
        print(f"Error: File not found at {file_path}")
        return None
    except ValueError as e:
        print(f"Error: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None


# --- Task 2: Basic Data Analysis ---
def analyze_data(data, categorical_col, numerical_col):
    """
    Performs basic data analysis.

    Args:
        data (pd.DataFrame): DataFrame to analyze.
        categorical_col (str): Name of the categorical column for grouping.
        numerical_col (str): Name of the numerical column to analyze.
    """

    try:
        if not all(col in data.columns for col in [categorical_col, numerical_col]):
            raise ValueError("Categorical or numerical column not found in DataFrame.")

        print(f"\n--- 2.1 Basic Statistics for {numerical_col} ---")
        print(data[numerical_col].describe())

        print(f"\n--- 2.2 Mean {numerical_col} by {categorical_col} ---")
        mean_by_group = data.groupby(categorical_col)[numerical_col].mean()
        print(mean_by_group)

        # Example pattern finding (this is very dependent on the data)
        if numerical_col in data.columns and 'Date' in data.columns:
            print("\n--- Example: Correlation between numerical column and Date ---")
            correlation = data[[numerical_col, 'Date']].corr()
            print(correlation)

        if categorical_col in data.columns:
            print(f"\n--- Value Counts for {categorical_col} ---")
            print(data[categorical_col].value_counts())

    except ValueError as e:
        print(f"Error: {e}")
    except KeyError as e:
        print(f"Error: Column not found - {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


# --- Task 3: Data Visualization ---
def visualize_data(data, x_col, y_col, categorical_col=None, plot_type="bar", title="", x_label="", y_label=""):
    """
    Creates various data visualizations.

    Args:
        data (pd.DataFrame): DataFrame to visualize.
        x_col (str): Column for x-axis.
        y_col (str): Column for y-axis (or None for histogram).
        categorical_col (str, optional): Column for color encoding in scatter plot/hue.
                                     Defaults to None.
        plot_type (str, optional): Type of plot ("line", "bar", "hist", "scatter").
                                 Defaults to "bar".
        title (str, optional): Title of the plot. Defaults to "".
        x_label (str, optional): Label for x-axis. Defaults to "".
        y_label (str, optional): Label for y-axis. Defaults to "".
    """

    try:
        plt.figure(figsize=(10, 6))  # Adjust figure size

        if plot_type == "line" and x_col in data and y_col in data:
            plt.plot(data[x_col], data[y_col])
        elif plot_type == "bar" and x_col in data and y_col in data:
            plt.bar(data[x_col], data[y_col])
        elif plot_type == "hist" and x_col in data:
            plt.hist(data[x_col], bins=20, edgecolor='black')  # Customize bins
        elif plot_type == "scatter" and x_col in data and y_col in data:
            if categorical_col:
                sns.scatterplot(x=x_col, y=y_col, hue=categorical_col, data=data)
            else:
                plt.scatter(data[x_col], data[y_col])
        else:
            raise ValueError(f"Invalid plot type or missing columns for {plot_type}")

        plt.title(title)
        plt.xlabel(x_label if x_label else x_col)
        plt.ylabel(y_label if y_label else y_col)
        plt.xticks(rotation=45, ha="right")
        plt.tight_layout()
        plt.show()

    except ValueError as e:
        print(f"Error: {e}")
    except KeyError as e:
        print(f"Error: Column not found - {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


# --- Main Execution ---
if __name__ == "__main__":
    # 1. Load and Explore (Using Iris Dataset)
    iris_df = load_and_explore_data(dataset_choice="iris")

    if iris_df is not None:
        # 2. Analyze (Iris Dataset)
        analyze_data(iris_df, categorical_col="species", numerical_col="sepal length (cm)")

        # 3. Visualize (Iris Dataset)
        visualize_data(iris_df, x_col="sepal length (cm)", y_col="sepal width (cm)",
                       plot_type="scatter", title="Sepal Length vs. Sepal Width",
                       categorical_col="species")
        visualize_data(iris_df, x_col="species", y_col="petal length (cm)",
                       plot_type="bar", title="Average Petal Length by Species")
        visualize_data(iris_df, x_col="petal length (cm)", plot_type="hist",
                       title="Petal Length Distribution")
        visualize_data(iris_df, x_col=iris_df.index, y_col="sepal length (cm)",
                       plot_type="line", title="Sepal Length over Index")  # Line plot (index as x)

        # --- Findings and Observations (Iris Dataset) ---
        print("\n--- Findings and Observations (Iris Dataset) ---")
        print("1.  The dataset contains measurements of sepal and petal length/width for three iris species (setosa, versicolor, virginica).")
        print("2.  There are no missing values in the cleaned dataset.")
        print("3.  'Setosa' has generally smaller petal lengths and widths compared to 'versicolor' and 'virginica'.")
        print("4.  There's some overlap in sepal measurements between 'versicolor' and 'virginica', but 'setosa' is distinct.")
        print("5.  The histogram shows the distribution of petal length, indicating a bimodal pattern.")

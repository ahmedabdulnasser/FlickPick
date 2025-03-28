import { User } from "../models/user.model.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function searchPerson(req, res) {
  const { query } = req.params;
  try {
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`
    );

    if (response.results.length === 0) {
      return res.status(404).send(null);
    }
    const searchResult = {
      id: response.results[0].id,
      image: response.results[0].profile_path,
      title: response.results[0].name,
    };

    const user = await User.findByIdAndUpdate(req.user._id);
    const exists = user.searchHistory.some(
      (item) => item.id === searchResult.id
    );

    if (!exists) {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: {
          searchHistory: {
            id: response.results[0].id,
            image: response.results[0].profile_path,
            title: response.results[0].name,
            searchType: "person",
            createdAt: new Date(),
          },
        },
      });
    }

    res.status(200).json({ success: true, data: response.results });
  } catch (error) {
    console.log("Error in searchPerson controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function searchMovie(req, res) {
  const { query } = req.params;
  try {
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`
    );

    if (response.results.length === 0) {
      return res.status(404).send(null);
    }

    const user = await User.findByIdAndUpdate(req.user._id);
    const searchResult = {
      id: response.results[0].id,
      image: response.results[0].profile_path,
      title: response.results[0].name,
    };

    const exists = user.searchHistory.some(
      (item) => item.id === searchResult.id
    );

    if (!exists) {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: {
          searchHistory: {
            id: response.results[0].id,
            image: response.results[0].poster_path,
            title: response.results[0].title,
            searchType: "movie",
            createdAt: new Date(),
          },
        },
      });
    }

    res.status(200).json({ success: true, data: response.results });
  } catch (error) {
    console.log("Error in searchMovie controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function searchTv(req, res) {
  try {
    const { query } = req.params;
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`
    );

    if (response.results.length === 0) {
      return res.status(404).send(null);
    }

    const user = await User.findByIdAndUpdate(req.user._id);
    const searchResult = {
      id: response.results[0].id,
      image: response.results[0].profile_path,
      title: response.results[0].name,
    };

    const exists = user.searchHistory.some(
      (item) => item.id === searchResult.id
    );

    if (!exists) {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: {
          searchHistory: {
            id: response.results[0].id,
            image: response.results[0].poster_path,
            title: response.results[0].name,
            searchType: "tv",
            createdAt: new Date(),
          },
        },
      });
    }

    res.status(200).json({ success: true, data: response.results });
  } catch (error) {
    console.log("Error in searchTv controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getSearchHistory(req, res) {
  try {
    res.status(200).json({ success: true, content: req.user.searchHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function deleteItemFromSearchHistory(req, res) {
  let { id } = req.params;
  id = parseInt(id);
  // console.log(typeof(id));
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        searchHistory: { id: id },
      },
    });

    res.status(200).json({
      success: true,
      message: "Item removed from search history successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

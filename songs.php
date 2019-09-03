<?php
  # This php file should return a list of all the songs available
  # as well as all the data for each (lyrics and category tags)

  $files = glob("songs/*");
  $output = [];
  for ($i = 0; $i < count($files); $i++) {
    $contents = file($files[$i], FILE_IGNORE_NEW_LINES);
    $song["name"] = trim($contents[0]);
    $song["tags"] = explode(" ", strtolower(trim($contents[1])));
    $lyrics = "";
    for ($j = 2; $j < count($contents); $j++) {
      $lyrics .= trim($contents[$j]) . "\n";
    }
    $song["lyrics"] = $lyrics;
    array_push($output, $song);
  }
  header("Content-type: application/json");
  echo json_encode(["songs" => $output,
                    "tags"  => file("tags.txt", FILE_IGNORE_NEW_LINES)]);
?>

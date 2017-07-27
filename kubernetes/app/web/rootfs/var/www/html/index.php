<?php

$hostname = gethostname();
$backend_url = $_ENV['BACKEND_HOST'];


function call_api($method, $endpoint, $keyname, $value) {
    $url = "http://". $_ENV['BACKEND_HOST'] . "/${endpoint}";
    $data = [$keyname => $value];

    $options = array(
        'http' => array(
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => $method,
            'content' => http_build_query($data)
        )
    );
    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);

    return $result;
}

# ADDING DATA
if (isset($_POST['task'])) {
    call_api('POST', 'add', 'task', $_POST['task']);
}

# DELETING DATA
if (isset($_GET['delete'])) {
    call_api('DELETE', 'delete', 'id', $_GET['delete']);
}

# RETRIEVING DATA
$backend_tasks = json_decode(file_get_contents("http://${backend_url}/tasks"), true);

?>

<!DOCTYPE html>
<html>
    <head>
        <title>KubePrimer PowerApp</title>
    </head>
    
    <body>
        <!-- Intro -->
        <div id="intro">
            <h1>KubePrimer PowerApp</h1>
            <p>With this app you will be able to create a very simple list of items.</p>
            <p>This page was served by <?php echo $hostname ?></p>
        </div>

        <!-- Form -->
        <div id="form">
            <form action="index.php" method="post">
                <input type="text" name="task">
                <input type="submit">
            </form>
        </div>

        <!-- List -->
        <div id="list">
            <table>
            <?php
                if (!empty($backend_tasks['tasks'])) {
                    foreach ($backend_tasks['tasks'] as $key => $value) {
                        echo "<tr><td>${value['task']}</td><td><a href=\"index.php?delete=${value['_id']}\">delete</a></td></tr>";
                    }
                } else {
                    echo "<tr><td>No data to show, yet!</tr></td>";
                }
            ?>
            </table>
        </div>
    </body>
</html>



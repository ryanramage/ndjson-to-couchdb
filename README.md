ndjson-to-couchdb
=================

Pipe ndjson into couchdb. Strems out the doc with the new _id and _rev.

Install
-------

    npm i ndjson-to-couchdb -g

Usage
-----

    cat tests/assets/example.njson | ndjson-to-couchdb http://localhost:5984/test

Options
-------

  - --force  if there is an existing doc with the same _id fetch the existing _rev and overwrite the doc.
  - --prev_rev_fiel=prev_rev add a field to the emitted doc with name 'prev_rev' that will hold the last _rev before the update

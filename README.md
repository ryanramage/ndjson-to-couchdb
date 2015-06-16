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

  - --force=true  if there is an existing doc with the same _id fetch the existing _rev and overwrite the doc.
  - --key=keyname the name of the field to use to set the primary key value.
  - --prev_rev_fiel=prev_rev add a field to the emitted doc with name 'prev_rev' that will hold the last _rev before the update
  - --copy_fields_from_prev_rev=a,b preserve the fields a and b values by copying the val from the old rev to the new rev

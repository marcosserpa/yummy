# yummy

#### to run

1) initialize elasticsearch (at the environment, aliased as 'elastic')
2) open rails console
3) run Aliment.reindex (all the time some index has changed or some insertion on the database has been made, this needs to be run)

#### styles
the application is using (http://purecss.io/) library version 0.6.0.

#### to update the database
we need to run the task:

```shell
rake integrate:update_aliments
```
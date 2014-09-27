class CreateVideosAndHashTags < ActiveRecord::Migration
  def change
    create_table :videos do |t|
      t.string :title
      t.datetime :recorded_at
      t.float :lat
      t.float :lng
      t.string :s3_key
      t.timestamps
    end

    create_table :hash_tags do |t|
      t.string :name
      t.timestamps
    end

    create_table :hash_tags_videos, id: false  do |t|
      t.belongs_to :video
      t.belongs_to :hash_tag
    end
  end
end

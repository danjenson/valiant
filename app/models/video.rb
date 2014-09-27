class Video < ActiveRecord::Base
  has_and_belongs_to_many :hash_tags
  validates :title, :recorded_at, :lat, :lng, :s3_key, presence: true
  validates :lat, numericality: true
  validates :lng, numericality: true

  scope :geosearch, -> (lat_low, lat_up, lng_low, lng_up) {
    where("lat > ? AND lat < ? AND lng > ? AND lng < ?",
          lat_low, lat_up, lng_low, lng_up).includes(:hash_tags)
  }

end
